let rowNumber = 8;
let lineNumber = 8;


class CheckerField
{
	constructor(figuresAndPositions, field)
	{
		this.assoiatedHTMLField = field;
		this.field = [];
		for(i = 0; i < figuresAndPositions.length; ++i)
		{
			this.field[figuresAndPositions.rowPosition][figuresAndPositions.linePosition] = figuresAndPositions[i];
		}
	}
	canGo(fromR, fromL, toR, toL)
	{
			if(this.field[fromR][fromL] !== null && this.field[fromR][fromL] !== undefined)
			{
				return true;
			}
			return false;
	}
	goTo(fromR, fromL, toR, toL)
	{
		if(canGo(fromR, fromL, toR, toL))
		{
				field[toR][toL] = field[fromR][fromL];
				field[fromR][fromL] = null;
		}
	}
}
class Figure
{
	constructor()
	{
		
	}
	getHTMLElement()
	{
		let temp = document.createElement("SPAN");
		temp.style.backgroundColor = 'tomato';
		return temp;
	}
}

function createTable(rowNumber, lineNumber)
{
	for(i = 0; i < rowNumber; ++i)
	{	
	let row = document.createElement("TR");
		for(j = 0; j < lineNumber;++j)
		{
			let cell = createCell();
			//cell.innerHTML = i + " " + j;
			cell.id = "cell_" + i + "_" + j;
			cell.dataset.row = 8 - i;
			cell.dataset.line = 1 + j;
			row.appendChild(cell);
		}
	field.appendChild(row);
	}
}
function createCell()
{
		let cell = document.createElement("TD");
		cell.onclick = hello;
		return cell;
}
function hello()
{
	let x = this.parentNode.rowIndex;
	let y = this.cellIndex;
	this.innerHTML = x + " " + y;
	if((x + y) % 2 === 0)
	{
		this.style.backgroundColor = 'white';
		this.style.color = 'black';
	}
	else
	{
		this.style.backgroundColor = 'black';
		this.style.color = 'white';
	}
}

let x = {figure: new Figure(), rowPosition: 5, linePosition: 5}
createTable(rowNumber, lineNumber);
let checker_field = new CheckerField(x, field);
let selected_figure;
