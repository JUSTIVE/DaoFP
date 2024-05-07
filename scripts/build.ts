import { execSync } from "child_process";

execSync("pdflatex -shell-escape ./content/6-FunctionTypes.tex -output-directory=./kr")