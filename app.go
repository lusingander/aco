package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"os/exec"
	"strings"

	"github.com/mattn/go-shellwords"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
	cfg *AppConfig
}

func NewApp(cfg *AppConfig) *App {
	return &App{cfg: cfg}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Commands() []*Command {
	return a.cfg.Commands
}

func (a *App) RunCommand(input string, c Command) (string, error) {
	if len(c.Pipeline) > 0 {
		return a.runPipeline(input, c)
	} else {
		return a.runCmd(input, c)
	}
}

func (a *App) runPipeline(input string, c Command) (string, error) {
	stderr := &bytes.Buffer{}

	cmds := make([][]string, 0)
	for _, cmd := range c.Pipeline {
		args, err := shellwords.Parse(cmd)
		if err != nil {
			return "", err
		}
		runtime.LogDebugf(a.ctx, "args: %v", args)
		cmds = append(cmds, args)
	}

	return output(cmds, input, stderr)
}

// cf: https://github.com/mattn/go-pipeline
func output(commands [][]string, input string, stderr io.Writer) (string, error) {
	cmds := make([]*exec.Cmd, len(commands))
	var err error

	for i, c := range commands {
		cmds[i] = exec.Command(c[0], c[1:]...)
		if i > 0 {
			if cmds[i].Stdin, err = cmds[i-1].StdoutPipe(); err != nil {
				return "", err
			}
		}
		cmds[i].Stderr = stderr
	}
	cmds[0].Stdin = strings.NewReader(input)
	var out bytes.Buffer
	cmds[len(cmds)-1].Stdout = &out
	for _, c := range cmds {
		if err = c.Start(); err != nil {
			return "", err
		}
	}
	for _, c := range cmds {
		if err = c.Wait(); err != nil {
			return "", err
		}
	}
	return out.String(), nil
}

func (a *App) runCmd(input string, c Command) (string, error) {
	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}

	args, err := shellwords.Parse(c.Cmd)
	if err != nil {
		return "", err
	}
	runtime.LogDebugf(a.ctx, "args: %v", args)

	var cmd *exec.Cmd
	if len(args) == 1 {
		cmd = exec.Command(args[0])
	} else {
		cmd = exec.Command(args[0], args[1:]...)
	}
	runtime.LogDebugf(a.ctx, "cmd: %v", cmd)

	cmd.Stdin = strings.NewReader(input)
	cmd.Stdout = stdout
	cmd.Stderr = stderr

	if err := cmd.Run(); err != nil {
		return "", err
	}
	if err := stderr.String(); len(err) > 0 {
		return "", errors.New(err)
	}
	return stdout.String(), nil
}
