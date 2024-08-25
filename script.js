// Fetch IPL data and visualize it
fetch('/api/ipl-data')
  .then(response => response.json())
  .then(data => {
    const playerNames = data.map(player => player.name);
    const playerRuns = data.map(player => player.runs);

    const ctx = document.getElementById('iplChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: playerNames,
        datasets: [{
          label: 'Runs Scored',
          data: playerRuns,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(err => console.error('Error fetching data:', err));
