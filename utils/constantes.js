const default_login = 'odc'
const default_password = '7112022'

const CGO = {id: 1, name: 'RDC', sigle: 'CGO'};
const BELGIQUE = {id: 2, name: 'Belgique', sigle: 'BEG'};
const USA = {id: 3, name: 'USA', sigle: 'USA'};
const FRANCE = {id: 4, name: 'France', sigle: 'FR'};

const countries = {
    CGO,
    BELGIQUE,
    USA,
    FRANCE
}

module.exports = {
    default_login,
    default_password,
    countries
};