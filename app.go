package main

import (
	"bytes"
	"context"
	"errors"
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
