  //Canvas1
  function loadHist(List)
  {

        var idd = [];
        var OldVolume = [];
        var NewVolume = [];

        //browse all element in the arraylist and attribute respective id, oldVol and newVol
        for (var i = 0; i< List.length; i++)
        {
          idd.push(List[i][0]);
          OldVolume.push(parseInt(List[i][1]));
          NewVolume.push(parseInt(List[i][2]));
        }

        //intialize the histogramme canvas
        var ctx = document.getElementById("canvas").getContext("2d");

        //defined histogramme content
        var barChartData =
        {
            labels: idd,
            datasets:
            [
              {
                label: 'Old Volume',
                backgroundColor: "blue",
                data: OldVolume
              },
              {
                label: 'New Volume',
                backgroundColor: "green",
                data: NewVolume
              }
            ]
        };

        //define histogramme parameter
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 2,
                        //borderColor: 'rgb(0, 255, 0)',
                        borderSkipped: 'bottom'
                    }
                },
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Volume evolution'
                }
            }
        });


  }
