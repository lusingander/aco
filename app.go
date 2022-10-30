package main

import (
	"context"
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
	return c.Description, nil
}
