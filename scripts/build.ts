import { execSync } from "node:child_process";

execSync("pdflatex -shell-escape ./kr/7-Recursion.tex -output-directory=./kr");
