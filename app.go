package main

import (
	"context"
	"strings"
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

func (a *App) ToUpper(in string) string {
	return strings.ToUpper(in)
}

func (a *App) Commands() []*Command {
	return a.cfg.Commands
}
