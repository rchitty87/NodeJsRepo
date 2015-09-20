var diners = [
    			{ 'Name' : 'Alice',
                  'Items' : [{'Name': 'Spaghetti', 'Price': 12.00}, 
                           {'Name': 'Coke', 'Price': 3.00}] 
                },
    			{ 'Name' : 'Bob',
                  'Items' : [{'Name': 'Steak', 'Price': 15.00}, 
                             {'Name': 'Wine', 'Price': 9.50}]
                },
    			{ 'Name' : 'Charles',
                  'Items' : [{'Name': 'Risotto', 'Price': 8.50},
                             {'Name': 'Sprite', 'Price': 3.00}]
                }
            ];

var totalBill;
var totalTax;
var totalTip;
var individual = [];

function addNewDiner(name) {
	for(var i=0; i<diners.length; ++i) {
        if(diners[i].Name === name)
            return;
    }
    
    diners.push({ 'Name': name, 'Items': [] });
}

function addNewItem(personName, itemName, price) {
	for(var i=0; i<diners.length; ++i) {
    	if(diners[i].Name === personName) {
        	diners[i].Items.push({ 'Name': itemName, 'Price': price });
            return;
        }            
    }
}

function getTax(n) {
    return parseFloat(((n/100.0)*7).toFixed(2));
}

function getTip(n) {
    return parseFloat(((n/100.0)*15).toFixed(2));
}

function addAllMeals() {
    totalBill = 0.0;
    
	for(var i=0; i<diners.length; ++i) {
    	//console.log(diners[i].Name);
        
        for(var j=0; j<diners[i].Items.length; ++j) {
    		//console.log(diners[i].Items[j].Name + ' : ' + diners[i].Items[j].Price);
            totalBill += diners[i].Items[j].Price;
        }
    }

    totalTax = getTax(totalBill);
    totalTip = getTip(totalBill + totalTax);
}

function calculateIndividualMeals() {
    individual = [];

    var individualTip = parseFloat((totalTip/diners.length).toFixed(2))
    for(var i=0; i<diners.length; ++i) {
        var individualBill = 0.0;

        for(var j=0; j<diners[i].Items.length; ++j) {
            individualBill += diners[i].Items[j].Price;
        }

        var individualTax = getTax(individualBill);

        individual.push({ 'Name': diners[i].Name, 'Bill': individualBill, 'Tax': individualTax, 'Tip': individualTip, 'Total': individualBill + individualTax + individualTip });
    }

    /*
    for(var i=0; i<individual.length; ++i) {
        console.log(individual[i].Name + ' : ' + individual[i].Bill + ', ' + individual[i].Tax + ', ' + individual[i].Tip + ', ' + (individual[i].Bill + individual[i].Tax + individual[i].Tip));
    }
    */

    calculateOffset();
}

function calculateOffset() {
    var total = totalBill + totalTax + totalTip;

    for(var i=0; i<individual.length; ++i) {
        total -= individual[i].Total;
    }

    if(total > 0) {
        var offset = parseFloat((total/diner.length).toFixed(2));

        for(var i=0; i<individual.length; ++i) {
            individual[i].Tip += offset;
        }
    }
}

/*
function test() {

    addNewItem('Alice', 'Beer', 5.00);

    addAllMeals();
    document.getElementById("totalBill").innerHTML = totalBill;
    document.getElementById("totalTax").innerHTML = totalTax;
    document.getElementById("totalTip").innerHTML = totalTip;

    calculateIndividualMeals();

    for(var i=0; i<individual.length; ++i) {
        console.log(individual[i].Name + ' : ' + individual[i].Bill + ', ' + individual[i].Tax + ', ' + individual[i].Tip + ', ' + (individual[i].Bill + individual[i].Tax + individual[i].Tip));
    }
}
*/