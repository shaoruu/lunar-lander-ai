/* Plot average fitness with chart.js */
class DataPlotter {
  constructor() {
    this.ctx = document.getElementById('my-chart').getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Average Fitness',
            data: [],
            backgroundColor: []
          }
        ]
      },
      options: {
        color: 'rgba(255,255,255,0.082)'
      }
    })
    this.chart.update()
  }

  addData = (label, data) => {
    this.chart.data.labels.push(label)
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data)
      dataset.backgroundColor.push('#d8ffd499')
    })
    this.chart.update()
  }
}
