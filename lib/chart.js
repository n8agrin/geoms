        var Chart = function(options) {
            withAdvice.call(this);
            this.init(options);
        };

        Chart.prototype = {
            init: function(options) {
                this.options = options || {};
                Object.extend(this, options);
                this.selector = options.selector;
                this.data = options.data || [];
                this.width = options.width || 600;
                this.height = options.width || 400;
                this.disabled = options.disabled || [];

                this.scales = {
                    x: d3.scale.linear(),
                    y: d3.scale.linear(),
                    color: d3.scale.category20()
                };

                this.geoms = [
                    scatter().scales(this.scales).size([this.width, this.height])
                ];

                this.svg = d3.select(this.selector)
                    .append('svg')
                    .attr('width', this.width)
                    .attr('height', this.height);

                this.canvas = this.svg.append('g')
                    .attr('class', 'canvas');

                this.geomsC = this.canvas.append('g')
                    .attr('class', 'geoms');

                this.xAxis = this.canvas.append('g')
                    .attr('class', 'x axis');

                this.yAxis = this.canvas.append('g')
                    .attr('class', 'y axis');
            },

            train: function() {
                xExtent = d3.extent(this.data, function(d) { return d[0]; });
                yExtent = d3.extent(this.data, function(d) { return d[1]; });
                this.scales.x.domain(xExtent);
                this.scales.y.domain(yExtent);
                this.scales.x.range([0, 600]);
                this.scales.y.range([0, 400]);
            },

            filter: function(data, grouper) {
                var chart = this;
                return data.filter(function(point) {
                    if (chart.disabled.indexOf(grouper(point)) == -1) {
                        return point;
                    }
                });
            },

            legend: function() {
                var legend,
                    ul,
                    li,
                    liUpdate,
                    group,
                    groups,
                    chart;

                chart = this;
                group = this.geoms[0].group();
                groups = d3.nest().key(group).map(this.data);
                legend = d3.select('#chart #legend');

                ul = legend.selectAll('ul')
                    .data(Object.keys(groups));

                ul.enter().append('ul');

                li = ul.selectAll('li')
                    .data(function(d) { return d; });

                li.enter()
                    .append('li');

                d3.transition(li)
                    .text(function(d) { return d; });

                li.on('click', function() {
                    var datum = d3.select(this).datum();
                    var datumIdx = chart.disabled.indexOf(datum);
                    if (datumIdx === -1) {
                        chart.disabled.push(datum);
                    } else {
                        chart.disabled.splice(datumIdx, 1);
                    }
                    chart.render();
                });
            },

            render: function() {
                var filteredData = this.filter(this.data, this.geoms[0].group());
                var boundData = this.geomsC.data([filteredData]);
                this.geoms.forEach(function(geom) {
                    d3.transition(boundData).call(geom);
                });
            }
        }