import { Component, Inject, Input, NgZone, PLATFORM_ID } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { isPlatformBrowser } from '@angular/common';


// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5locales_es_ES from "@amcharts/amcharts5/locales/es_ES";

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  private root!: am5.Root;
  @Input('titulosChart') titulosChart: any;
  @Input('dataChart') dataChart: any;
  @Input('maxY') maxY: any;
  @Input('tipoChart') tipoChart: any;
  @Input('dataColumnas') dataColumnas: any;
  @Input('dataSeries') dataSeries: any;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let root = am5.Root.new(this.titulosChart.nombreChart);
      root.utc = true;
      root.timezone = am5.Timezone.new("America/Bogota");
      root.locale = am5locales_es_ES;

      const myTheme = am5.Theme.new(root);
      myTheme.rule("Label").setAll({
        fontSize: "10px",
        fontFamily: "Raleway"
      });

      root.setThemes([
        am5themes_Animated.new(root),
        myTheme
      ]);

      if (this.tipoChart == 'arbol') {
        let container = root.container.children.push(am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: root.verticalLayout
        }));

        let series: any = container.children.push(
          am5hierarchy.ForceDirected.new(root, {
            singleBranchOnly: false,
            downDepth: 1,
            topDepth: 1,
            maxRadius: 40,
            minRadius: 12,
            valueField: this.titulosChart.valor,
            categoryField: this.titulosChart.nombre,
            childDataField: "children",
            idField: this.titulosChart.nombre,
            xField: "x",
            yField: "y",
            linkWithStrength: 0.3,
            linkWithField: "linkWith",
            manyBodyStrength: -15,
            centerStrength: 0.5,
            nodePadding: 10,
            templateField: "nodeSettings",
            legendLabelText: `[bold]{${this.titulosChart.nombre}}[/] - {${this.titulosChart.valor}}`
          })
        );


        series.circles.template.adapters.add("radius", (radius: any, target: any) => {
          const data = target.dataItem.dataContext;
          return data.nodeSettings?.radius || radius;
        });

        series.circles.template.setAll({
          templateField: "nodeSettings"
        });

        series.nodes.template.set("tooltipText", `{${this.titulosChart.valor}}`);
        series.data.setAll([this.dataChart]);

        series.set("selectedDataItem", series.dataItems[0]);

        if (window.innerWidth <= 768) {
          container.setAll({
            scale: 0.5,
            width: am5.percent(200),
            height: am5.percent(200)
          });
        } else {
          container.setAll({
            scale: 1,
            width: am5.percent(100),
            height: am5.percent(100)
          });
        }

        let legend = container.children.push(
          am5.Legend.new(root, {
            x: am5.p50,
            centerX: am5.p50,
            templateField: "nodeSettings"
          })
        );

        legend.markers.template.adapters.add("background", (fill: any, target: any) => {
          console.log('fill:', fill)
          console.log('target:', target)
          const dataItem = target.dataItem;
          if (dataItem && dataItem.get("nodeSettings")) {
            return dataItem.get("nodeSettings").fill;  // Aquí obtenemos el color del nodo
          }
          return fill;  // Devuelve el color predeterminado si no se encuentra el nodo
        });
        legend.valueLabels.template.set("forceHidden", true);
        legend.data.setAll(series.dataItems[0].get("children").reverse());

        series.appear(1000, 100);
      } else {
        if (!this.tipoChart) {
          root.dateFormatter.setAll({
            dateFormat: "MMMM",
            dateFields: ["valueX"]
          });
        }

        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            layout: root.verticalLayout
          })
        );

        console.log('this.dataChart', this.dataChart)
        console.log('this.dataColumnas:', this.dataColumnas)
        console.log('this.dataSeries:', this.dataSeries)

        let xRenderer = am5xy.AxisRendererX.new(root, {
          minorGridEnabled: true
        });

        let xAxis: any = chart.xAxes.push(
          this.titulosChart.anual ?
            am5xy.CategoryAxis.new(root, {
              categoryField: this.titulosChart.columna,
              renderer: xRenderer,
              tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal"
              })
            }) :
            am5xy.DateAxis.new(root, {
              groupData: true,
              baseInterval: { timeUnit: "month", count: 1 },
              gridIntervals: [{ timeUnit: "month", count: 1 }],
              renderer: xRenderer,
              tooltip: am5.Tooltip.new(root, {
                pointerOrientation: "horizontal"
              }),
              tooltipDateFormat: "MMMM"
            })
        );

        if (this.titulosChart.anual) {
          xRenderer.grid.template.setAll({
            location: 1
          });

          xAxis.data.setAll(this.dataChart);
        }

        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        }));
        cursor.lineY.set("visible", false);

        let valueAxisY;

        if (['columnTotales', 'columnasCategoria', 'columnLaterales'].includes(this.tipoChart) && !this.titulosChart.anual) {
          xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: this.titulosChart.columna,
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal"
            })
          }));
          console.log('xAxis:', xAxis)

          xAxis.data.setAll(this.dataChart);

          valueAxisY = {
            min: 0,
            max: this.maxY,
            numberFormat: "#",
            strictMinMax: false,
            calculateTotals: true,
            renderer: am5xy.AxisRendererY.new(root, {
              strokeOpacity: 0.1
            })
          };
        } else {
          valueAxisY = {
            renderer: am5xy.AxisRendererY.new(root, {
              pan: "zoom"
            })
          };
        }

        const yAxis: any = chart.yAxes.push(
          am5xy.ValueAxis.new(root, valueAxisY)
        );

        if (this.titulosChart.objetivo) {
          let range = yAxis.makeDataItem({
            value: this.titulosChart.objetivo
          });

          yAxis.createAxisRange(range);

          range.get("grid").setAll({
            stroke: am5.color(0xff0000),
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeDasharray: [4, 4]
          });

          range.get("label").setAll({
            text: (this.titulosChart.textoObjetivo ? this.titulosChart.textoObjetivo : "Objetivo") + this.titulosChart.objetivo,
            fill: am5.color(0xff0000),
            centerY: am5.p100,
            centerX: am5.p0,
            opacity: 1,
            dy: -5
          });
        }

        if (this.dataColumnas && this.dataColumnas.length > 0) {
          this.dataColumnas.forEach((config: any) => {
            const columnSeries = this.addColumn(root, config.nombre, config.atributo, config.columna, chart, xAxis, yAxis);
            const dataSet: any = {
              width: am5.percent(config.width)
            };
            if (this.titulosChart.anual) dataSet.templateField = "columnSettings";
            if (config.fillOpacity) dataSet.fillOpacity = config.fillOpacity;
            if (config.strokeOpacity || config.strokeOpacity == 0) dataSet.strokeOpacity = config.strokeOpacity;

            columnSeries.columns.template.setAll(dataSet);
            columnSeries.set("fill", am5.color(config.color));
            if (!this.tipoChart) {
              columnSeries.data.processor = am5.DataProcessor.new(root, {
                dateFields: [config.columna],
                dateFormat: "MMMM"
              });
            }
            columnSeries.data.setAll(this.dataChart);
          });
        }

        if (this.dataSeries && this.dataSeries.length > 0) {
          this.dataSeries.forEach((config: any) => {
            const series = this.addSerie(root, config.nombre, config.atributo, config.columna, chart, xAxis, yAxis, config.color);
            if (config.width) {
              const dataSet: any = {
                width: am5.percent(config.width)
              };
              series.columns.template.setAll(dataSet);
            }
            if (!this.tipoChart || this.titulosChart.anual) {
              series.strokes.template.setAll(config.strokeStyle);
            }
            series.data.setAll(this.dataChart);
            series.appear(1000);
          });
        }

        if (['columnTotales', 'columnasCategoria', 'columnLaterales'].includes(this.tipoChart) && !this.titulosChart.anual) {
          chart.set("scrollbarX", am5.Scrollbar.new(root, {
            orientation: "horizontal"
          }));
        }

        let legend = chart.children.push(
          am5.Legend.new(root, {
            x: am5.p50,
            centerX: am5.p50
          })
        );
        legend.data.setAll(chart.series.values);

        chart.appear(1000, 100);
      }
    }, 500);
  }


  addColumn(root: any, titulo: string, valor: string, columna: string, chart: any, xAxis: any, yAxis: any) {
    const dataColumn: any = {
      name: titulo,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: valor,
      clustered: false,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{name}: {valueY}"
      })
    };
    this.titulosChart.anual ? dataColumn.categoryXField = columna : dataColumn.valueXField = columna;
    const column = chart.series.push(
      am5xy.ColumnSeries.new(root, dataColumn)
    );

    column.set("tooltipText", "{name}: {valueY}");

    return column;
  }

  addSerie(root: any, titulo: string, valor: string, columna: string, chart: any, xAxis: any, yAxis: any, color: string) {

    let serie: any;
    if (['columnTotales', 'columnasCategoria', 'columnLaterales'].includes(this.tipoChart) && !this.titulosChart.anual) {
      const dataColSerie: any = {
        name: titulo,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valor,
        categoryXField: columna,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      };

      if (this.tipoChart == 'columnTotales') dataColSerie.stacked = true;
      if (this.tipoChart == 'columnasCategoria') dataColSerie.clustered = false;

      serie = chart.series.push(
        am5xy.ColumnSeries.new(root, dataColSerie));
    } else {
      const dataSerie: any = {
        name: titulo,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: valor,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      };

      this.titulosChart.anual ? dataSerie.categoryXField = columna : dataSerie.valueXField = columna;
      serie = chart.series.push(
        am5xy.SmoothedXLineSeries.new(root, dataSerie)
      );
    }

    serie.set("fill", am5.color(color));
    serie.set("stroke", am5.color(color));
    serie.set("tooltipText", "{name}: {valueY}")

    if (!['columnLaterales'].includes(this.tipoChart)) {
      serie.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            stroke: serie.get("fill"),
            strokeWidth: 2,
            fill: root.interfaceColors.get("background"),
            radius: 5
          })
        });
      });
    }

    return serie;
  }

  ngOnDestroy() {
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

}
