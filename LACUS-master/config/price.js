exports.priceCalc = function(distance){
var price = 0;
var tmpZoneStart = 0;
var zoneEnd = 10;
var zoneIndex = 0.2;
var i = 0;
/*Full zone calculation*/
while(distance >= zoneEnd && i <= 8 ){
   price = price +((zoneEnd-tmpZoneStart)*zoneIndex);
   /*Zone update */
   tmpZoneStart = zoneEnd;
   zoneEnd = ((i+2)*10)+tmpZoneStart;
   zoneIndex= zoneIndex-0.01;
   i++;
}
/*Calculation of the plus kilometers*/
if(distance-tmpZoneStart>0) price = price + ((distance-tmpZoneStart)*zoneIndex)
return price;
}