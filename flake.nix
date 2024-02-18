{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.11";
  };

  outputs = { self, nixpkgs }:
    let 
      systems = [ "aarch64-darwin" "aarch64-linux" "x86_64-darwin" "x86_64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f (import nixpkgs { inherit system;
        overlays = [
          (final: prev: { nodejs = prev.pkgs.nodejs_20; })
        ];
      }));
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
          ];
        };
      });
    };
}
