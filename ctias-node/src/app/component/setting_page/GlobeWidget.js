import * as d3 from "d3";
import {DomComponent} from "../../util/EventEmitter";

const _html = `
 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="globe" >
 </svg>
`

export default class GlobeWidget extends DomComponent {
    constructor(domSelector) {
        super(domSelector)
        this.domContainer.innerHTML = _html

        this.width = this.domContainer.offsetWidth
        this.height = this.domContainer.offsetHeight
        this.config = {
            speed: 0.005,
            verticalTilt: -30,
            horizontalTilt: 0
        }
        this.locations = [];
        this.svg = d3.select('svg.globe')
            .attr('width', this.width)
            .attr('height', this.height)

        this.svg
            .style('margin-top', 100)

        this.markerGroup = this.svg.append('g');
        this.projection = d3.geoOrthographic();
        this.initialScale = this.projection.scale();
        this.path = d3.geoPath().projection(this.projection);
        this.center = [this.width/2, this.height/2];
    }

    drawGlobe() {
        let li = ['https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json']
        this.locations = [
        {"latitude": 22, "longitude": 88},
            {"latitude": 12.61315, "longitude": 38.37723},
            {"latitude": -30, "longitude": -58},
            {"latitude": -14.270972, "longitude": -170.132217},
            {"latitude": 28.033886, "longitude": 1.659626},
            {"latitude": 40.463667, "longitude": -3.74922},
            {"latitude": 35.907757, "longitude": 127.766922},
            {"latitude": 23.634501, "longitude": -102.552784}
        ]

        let pArray = []
        li.forEach(url=>{
            pArray.push(
                new Promise((resolve,reject)=>{
                    d3.json(url)
                    .then(response=>{
                        resolve(response)
                    })
                    .catch(err=>{
                        reject(err)
                    })
                })
            )
        })

        Promise.all(pArray)
        .then(resArray=>{
            let worldData = resArray[0]

            this.svg.selectAll('.segment')
                .data(topojson.feature(worldData, worldData.objects.countries).features)
                .enter().append("path")
                .attr("class", "segment")
                .attr("d", this.path)
                .style("stroke", "#888")
                .style("stroke-width", "1px")
                .style("fill", (d, i) => '#e5e5e5')
                .style("opacity", ".6")

            this.drawMarkers()
        })
    }

    drawGraticule() {
        const graticule = d3.geoGraticule()
            .step([10, 10]);

        this.svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", this.path)
            .attr("x", this.width/2)
            .attr("y", this.height/2)
            .style("fill", "#fff")
            .style("stroke", "#ccc")
    }

    enableRotation() {
        d3.timer((elapsed) => {
            this.projection.rotate([this.config.speed * elapsed - 120, this.config.verticalTilt, this.config.horizontalTilt]);
            this.svg.selectAll("path").attr("d", this.path);
            this.drawMarkers();
        });
    }

    drawMarkers() {
        const markers = this.markerGroup.selectAll('circle')
            .data(this.locations);
        markers
            .enter()
            .append('circle')
            .merge(markers)
            .attr('cx', d => this.projection([d.longitude, d.latitude])[0])
            .attr('cy', d => this.projection([d.longitude, d.latitude])[1])
            .attr('fill', d => {
                const coordinate = [d.longitude, d.latitude];
                let gdistance = d3.geoDistance(coordinate, this.projection.invert(this.center));
                return gdistance > 1.57 ? 'none' : 'red';
            })
            .attr('r', 7);

        this.markerGroup.each(function () {
            this.parentNode.appendChild(this);
        });
    }
}