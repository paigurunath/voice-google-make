const _ = require('lodash');

module.exports = {
    createOxfordCommaList(list, andOr = 'and') {

        console.log('length', list.length);

        if (list.length <= 1) return list[0];

        return _.chain(list)
            .slice(0)
            .thru(value => {
                value.push(`${andOr} ${value.splice(-1)}`);
                return value;
            })
            .join(' ')
            .value();
    },
    compileTemplate(template, vars) {
        const tpl = _.template(template);
        return tpl(vars);
    }
}

//.join('<break time=\"300ms\"/> ')