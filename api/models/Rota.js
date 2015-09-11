/**
* Rota.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    rot_code  : { type: 'string', unique: true },
    rot_description  : { type: 'string', unique: true },
    rot_order  : { type: 'integer', unique: true },
  }
};

