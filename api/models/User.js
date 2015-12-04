var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email' }, //,  unique: true },
    display_name     : { type: 'string' }, //,  unique: true },
	cardid : { type: 'string' }, 
    manager     : { type: 'boolean' }, //,  unique: true },
    passports : { collection: 'Passport', via: 'user' }
  }
};

module.exports = User;
