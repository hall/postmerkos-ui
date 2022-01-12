{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    nodejs
    zip
  ];

  shellHook = ''
  '';
}

