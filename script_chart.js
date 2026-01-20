async function drawStatsChart(n) {

    const ctx = document.getElementById(`statsChart${n}`).getContext('2d');
    const CONFIG_BG_COLOR = [
      'rgb(215 252 252 / 60%)'
      
    ];
    const CONFIG_BORDER_COLOR = [
      'rgba(0,0,0,1)',
    
    ];
    const CONFIG_CHART_OPTIONS = {
      scales: {
        y: {
          beginAtZero: true,
          max:160,
          
        }
  }
    };
     drawChart(ctx, CONFIG_CHART_OPTIONS, CONFIG_BORDER_COLOR, CONFIG_BG_COLOR);
  }
  
  
 function drawChart(ctx, CONFIG_CHART_OPTIONS, CONFIG_BORDER_COLOR, CONFIG_BG_COLOR) {
  
    const statsChart = new Chart(ctx, {
      
      type: 'bar',
      data: {
        labels: statsLabels,
        datasets: [{
          label:'Statistics of '+ currentPokemon.name,
          data: statsData,
          borderWidth: 1,
          borderRadius:10,
          backgroundColor: CONFIG_BG_COLOR,
          borderColor: CONFIG_BORDER_COLOR,
          barPercentage: 0.99,
          barThickness: "flex",
          categoryPercentage:1
        }]
      },
      options: CONFIG_CHART_OPTIONS,
    });
  
  }
  