var point = function() {
    var geom,
        x = function(d) { return d[0]; },
        y = function(d) { return d[1]; },
        group = function(d) { return d[2]; },
        r = d3.functor(4),
        color = group,
        size = [1, 1],
        scales = {
            x: d3.scale.linear(),
            y: d3.scale.linear(),
            color: d3.scale.category20()
        },
        enter = function() {
            this.style('opacity', 1)
                .attr('r', r);
        },
        update = function() {
            var height = size[1];
            this.attr('cx', function(d) { return scales.x(x(d)); })
                .attr('cy', function(d) { return height - scales.y(y(d)); });
        },
        exit = function() {
            this.remove();
        };

    geom = function() {
        var width = size[0],
            height = size[1];

        this.each(function() {

            var circleGroups,
                circles,
                circlesEnter,
                circlesUpdate,
                circlesExit,
                grouper = d3.nest().key(group),
                dThis = d3.select(this);

            circleGroups = dThis.selectAll('g.group')
                .data(grouper.entries);

            circleGroups.enter()
                .append('g')
                .attr('class', function(d) { return 'group ' + d.key; });

            d3.transition(circleGroups.exit())
                .remove();

            circles = circleGroups.selectAll('circle')
                .data(function(d) { return d.values });

            circles.enter().append('circle').call(enter);
            circles.exit().call(exit);
            circlesUpdate = circles.call(update, scales, width, height, x, y)
                // .each(function() {
                //     var t = d3.transition(d3.select(this))
                //     // debugger
                //     t
                //         .attr('cx', function(d) { return scales.x(x(d)); })
                //         .attr('cy', function(d) { return height - scales.y(y(d)); });

                // })

            if (scales.color) {
                circlesUpdate.style('fill', function(d) {
                    return scales.color(color(d));
                });
            }
        });
    };

    geom.x = function(v) {
        if (arguments.length) {
            x = v;
            return geom;
        }
        return x;
    }

    geom.y = function(v) {
        if (arguments.length) {
            y = v;
            return geom;
        }
        return y;
    }

    geom.r = function(v) {
        if (arguments.length) {
            r = typeof v == 'function' ? v : d3.functor(v);
            return geom;
        }
        return r;
    }

    geom.group = function(v) {
        if (arguments.length) {
            group = v;
            return geom;
        }
        return group;
    }

    geom.color = function(v) {
        if (arguments.length) {
            color = v;
            return geom;
        }
        return color;
    }

    geom.scales = function(v) {
        if (arguments.length) {
            scales = v;
            return geom;
        }
        return scales;
    }

    geom.size = function(v) {
        if (arguments.length) {
            size = v;
            return geom;
        }
        return size;
    }

    geom.enter = function(v) {
        if (arguments.length) {
            enter = v;
            return geom;
        }
        return enter;
    }

    geom.update = function(v) {
        if (arguments.length) {
            update = v;
            return geom;
        }
        return update;
    }

    geom.exit = function(v) {
        if (arguments.length) {
            exit = v;
            return geom;
        }
        return exit;
    }

    geom.exitEnd = function(v) {
        if (arguments.length) {
            exitEnd = v;
            return geom;
        }
        return exitEnd;
    }

    return geom;
}