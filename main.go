package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed all:frontend/dist
var assets embed.FS

func run() error {
	cfg, err := loadAppConfig()
	if err != nil {
		return err
	}

	app := NewApp(cfg)

	return wails.Run(&options.App{
		Title:            "aco",
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})
}

func main() {
	if err := run(); err != nil {
		println("Error:", err.Error())
	}
}
