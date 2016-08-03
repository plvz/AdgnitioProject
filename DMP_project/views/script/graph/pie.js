function LoadPie(List)
{

  var id = [];
  var NewVolume = [];
  var VarrandomColor = [];

  //set random rgb color size
  var randomColorFactor = function() {
      return Math.round(Math.random() * 255);
  };

  //set random rgb color
  var randomColor = function(opacity) {
      return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
  };

  //browse all element in the arraylist and attribute respective id and newVol
  for (var i = 0; i< List.length; i++)
  {
    id.push(List[i][0]);
    NewVolume.push(parseInt(List[i][2]));
    VarrandomColor.push(randomColor()); //generate randomColor for each id content
  }

  //set pie chart config
  var config = {
      type: 'pie',
      data: {
          datasets: [{
              data: NewVolume,
              backgroundColor: VarrandomColor,
          }],
          labels: id
      },
      options: {
          responsive: true,
          legend: {
              display: false
          }
      }
  };

//initialize pie char canvas
  var ctx = document.getElementById("chart-area").getContext("2d");
  window.myPie = new Chart(ctx, config);

}
