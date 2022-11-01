package main

import (
	"io"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type AppConfig struct {
	Commands []*Command
}

// json tag is required to output models.ts :(
type Command struct {
	Cmd         string `json:"cmd"`
	Description string `json:"description"`
}

func loadAppConfig() (*AppConfig, error) {
	path, err := configFilePath()
	if err != nil {
		return nil, err
	}

	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	return decodeConfig(f)
}

func configFilePath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	path := filepath.Join(home, ".config", "aco", "aco.yaml")
	return path, nil
}

func decodeConfig(r io.Reader) (*AppConfig, error) {
	ac := &AppConfig{}
	if err := yaml.NewDecoder(r).Decode(ac); err != nil {
		return nil, err
	}
	return ac, nil
}
