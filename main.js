
function main(complexChemicalFormulaString)
{
	let y = assignCoefficients(complexChemicalFormulaString);
		y = applyMultipliers(y);
		y = getUniqueElementsCount(y);

	console.log(y);
	return y;
}

// Assign Coefficients to each unique element.
function assignCoefficients(chemCompound)
{
	chemCompound = chemCompound.replace(/\)(\d)+/g,'}$1').replace(/\](\d)+/g,'}$1').replace(/\(|\[/g,'{');
	let numberedCompound = '';
	for(let x = 0; x < chemCompound.length; x++)
	{
		let CanHaveCoefficient = true;
		numberedCompound += chemCompound[x];
		CanHaveCoefficient = CanHaveCoefficient & 
							 isNaN(Number(chemCompound[x])) &
							 chemCompound[x].match(/\{|\}/) === null;
		if(chemCompound[x+1] !== undefined)
		{
			CanHaveCoefficient = CanHaveCoefficient & 
								 isNaN(Number(chemCompound[x + 1])) & 
								 chemCompound[x + 1].match(/[a-z]/) === null;
		}
		if(!CanHaveCoefficient){
			continue;
		}
		numberedCompound += '1';
	}
	return numberedCompound;
}
// Serially apply multipliers to nested compounds in reverse order.
function applyMultipliers(chemCompound)
{
	let multipliedCompound = '';
	let currentMultiplier = 1, lastCoefficient = 1;
	let multiplyingFactor = [1];
	let hitNumberLast = false;
	for (let x = chemCompound.length - 1; x >= 0; x--) {
		currentMultiplier = multiplyingFactor.reduce((a,b) => {return a * b;});
		if (!isNaN(Number(chemCompound[x])))
		{
			lastCoefficient = (hitNumberLast)? Number(reverseString(reverseString(lastCoefficient) + chemCompound[x])) : Number(chemCompound[x]);
			hitNumberLast = true;
		} else {
			multipliedCompound += (hitNumberLast)? reverseString(chemCompound[x] + reverseString(lastCoefficient) * currentMultiplier) : chemCompound[x];
			hitNumberLast = false;
		}
		if (chemCompound[x].match(/\}/) !== null){
			multiplyingFactor.push(lastCoefficient);
		} else if (chemCompound[x].match(/\{/) !== null){
			multiplyingFactor.pop();
		}
	}
	return reverseString(multipliedCompound).replace(/\}(\d)+|\{/g,'');
}
// Leverage array functions to reverse strings.
function reverseString(someString)
{
	return String(someString).split('').reverse().join('');
}
// Narrow down and isolate distinct elements with respective occurence.
function getUniqueElementsCount(compoundString)
{
	let compoundArray = compoundString.match(/[A-Za-z]+[0-9]+/g);	
	let roughCompound = {};
	let compound = [];
	for(let x = 0; x < compoundArray.length; x++)
	{
		let elementCountTupule = compoundArray[x].replace(/([A-Za-z]+)([0-9]+)/,'$1:$2').split(':');
		if(roughCompound[elementCountTupule[0]] !== undefined)
		{
			roughCompound[elementCountTupule[0]] += Number(elementCountTupule[1]);
		} else {
			roughCompound[elementCountTupule[0]] = Number(elementCountTupule[1]);
		}
	}
	return roughCompound;
}
