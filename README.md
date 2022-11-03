# aco

Apply shell COmmand

<img src="./resources/image.png" width=600>

## Setup

Command settings are loaded from `~/.config/aco/aco.yaml`.

```yaml
commands:
  - cmd: jq .
    description: format json
  - pipeline:
      - grep foo
      - sort
      - uniq
    description: grep foo, sort, uniq
```

## License

MIT
