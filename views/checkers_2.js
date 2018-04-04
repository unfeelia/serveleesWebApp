let rowNumber = 8;
let colNumber = 8;

let firstChoosedCell = null;
let secondChoosedCell = null;
let firstChoosedCellStyle = {"backgroundColor": "yellow"};
let secondChoosedCellStyle = {"backgroundColor": "green"};
let simpleCellStyle = {"backgroundColor": "white"};

function chooseCell(x, y)
{

	if(firstChoosedCell != null && secondChoosedCell == null)
	{
		secondChoosedCell = $("[data-row='"+x+"'][data-col='"+y+"']");
		secondChoosedCell.css(secondChoosedCellStyle);
	}
	else
	if(firstChoosedCell == null && secondChoosedCell == null)
	{
		firstChoosedCell = $("[data-row='"+x+"'][data-col='"+y+"']");
		firstChoosedCell.css(firstChoosedCellStyle);
	}
	else
	if(firstChoosedCell != null && secondChoosedCell != null)
	{
		firstChoosedCell.css(simpleCellStyle);
		secondChoosedCell.css(simpleCellStyle);
		firstChoosedCell = null;
		secondChoosedCell = null;
	}
}

function hello()
{
	let th = $(this);
	chooseCell(th.data("row"), th.data("col"));
	
	
	//let wh = "rgb(255, 255, 255)";
	// let bl = "rgb(0, 0, 0)";
	// if(th.css("backgroundColor") == bl)
	// {
		// th.css("backgroundColor", "white");
		// th.css("color", "black");
		// console.log(th.css("backgroundColor") + " " + th.css("color"));
	// }
	// else
	// if(th.css("backgroundColor") == wh)
	// {
		// th.css("backgroundColor", 'black');
		// th.css("color", "white");
		// console.log(th.css("backgroundColor") + " " + th.css("color"));
	// }
	// else
	// {
		// th.css("backgroundColor", "black");
		// th.css("color", "white");
		// console.log(th.css("backgroundColor") + " " + th.css("color"));
	// }
}

function createTableContent(table)
{
	let headerPattern = $("<thead></thead>",
	{
		"class": "tableHead"
	});
	let headerCellPattern = $("<th></th>");
	let rowPattern = $("<tr></tr>");
	let tBody = $("<tbody></tbody>");
	let tableCell = $("<td></td>",
	{
		"class": "tableCell"
	});
	
	let rp = rowPattern.clone(true, true);
	headerCellPattern.clone(true, true).appendTo(rp);
	for(i = 0; i < colNumber; ++i)
	{
		let hcp = headerCellPattern.clone(true, true);
		hcp.text(String.fromCharCode(97 + i));
		hcp.appendTo(rp);
	}
	rp.appendTo(table);
	
	
	for(i = 0; i < rowNumber; ++i)
	{
		let rp = rowPattern.clone(true, true);
		rp.addClass("tableRow");
		let hcp = headerCellPattern.clone(true, true);
		hcp.text(8 - i);
		hcp.appendTo(rp);
		for(j = 0; j < colNumber; ++j)
		{
			let tc = tableCell.clone(true, true);
			rp.append(tc);
			tc.text(i + 1 + " " + (j + 1));
			tc.click(hello);
		}
		rp.appendTo(tBody);
	}
	tBody.appendTo(table);
	$(".tableCell").each(function(index, element)
	{
		$(this).attr("data-col", $(this).parent().children().index($(this)));
	});
	$(".tableRow").each(function(index, element)
	{
		$(element).children().each(function()
		{
			$(this).attr("data-row", index + 1);
		}
		);
	});

}

createTableContent($(field));
field.className += " table table-striped table-bordered table-hover table-condensed table-responsive";