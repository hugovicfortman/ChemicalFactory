
function main(complexChemicalFormulaString)
{
	let chemCompound = sortComplexChemicalToComponents(complexChemicalFormulaString).map(giveElementsMultipliers).reduce(applyParentMultipliers);
	console.log(getUniqueElementsCount(chemCompound))
}

function sortComplexChemicalToComponents(chemicalString)
{
	const simplifiedString = chemicalString.replace(/\)(\d)+/g,'}$1').replace(/\](\d)+/g,'}$1').replace(/\(|\[/g,'{');
	let rawChemicalArray = [];
	let processPlant = simplifiedString;
	const chemicalComplexityDegree = simplifiedString.search(/\{/);
	for(let x = 0; x < chemicalComplexityDegree; x++)
	{
		if(processPlant.match(/\{[A-Za-z0-9_]+\}/) === null)
		{
				continue;
		}
		rawChemicalArray.push(processPlant.match(/\{[A-Za-z0-9_]+\}/)[0].replace(/\{|\}/g,''));
		processPlant = processPlant.replace(/\{[A-Za-z0-9_]+\}/,'_');
	}
	rawChemicalArray.push(processPlant);
	return rawChemicalArray;
}


// The following algo needs refining and refactoring...
function giveElementsMultipliers(chemCompound)
{
	let numberedCompound = '';
	for(let x = 0; x < chemCompound.length; x++)
	{
		if(chemCompound[x +1] ===undefined)
		{
			numberedCompound += (isNaN(Number(chemCompound[x])))? chemCompound[x] + '1' : chemCompound[x];
			continue;
		} else if (!isNaN(chemCompound[x])) {
			numberedCompound += chemCompound[x];
			continue;
		}
		if(chemCompound[x +1].match(/[A-Z_]/) !== null && chemCompound[x + 1].match(/[0-9]/) === null)
		{
			numberedCompound += chemCompound[x] + '1';
		}else{
			numberedCompound += chemCompound[x];
		}
	}
	return numberedCompound;
}

function applyMultiplier(chemCompound, multiplier)
{
	let multipliedCompound = '';
	for(let x = 0; x < chemCompound.length; x++)
	{
		multipliedCompound += (isNaN(Number(chemCompound[x])))? chemCompound[x] : Number(chemCompound[x]) * multiplier;
	}
	return multipliedCompound;
}

function applyParentMultipliers (a, b)
{
	let multiplier = Number(b.replace(/[A-Za-z0-9]+_(\d)+[A-Za-z0-9]*/,'$1'));
	return b.replace(/\_(\d)+/,applyMultiplier(a,multiplier));
}

function getUniqueElementsCount(compoundString)
{
	let compoundArray = compoundString.match(/[A-Za-z]+[0-9]+/g);	
	let roughCompound = {};
	let compound = [];
	for(let x = 0; x < compoundArray.length; x++)
	{
		if(roughCompound[compoundArray[x]] !== undefined)
		{
			roughCompound[compoundArray[x]] += 1;
		} else {
			roughCompound[compoundArray[x]] = 1;
		}
	}
	for(let x in roughCompound)
	{
		compound.push(applyMultiplier(x, roughCompound[x]));
	}
	return JSON.parse("{" + compound.map((a) => {return a.replace(/([A-Za-z]+)([0-9]+)/,'"$1":$2');}).join(',') + "}");
}
