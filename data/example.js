


//https://docs.ponyorm.org/
//https://github.com/ponyorm/pony/
//https://www.fullstackpython.com/object-relational-mappers-orms.html
//https://www.dabapps.com/blog/django-models-and-encapsulation/


orm.exec(()=> Order.filter(p=> p.id = id)
                   .include(OrderDetail.filter(p => p.enable).map(p=> p)
                           .include(Product).map(p=> p.name))
                   .include(Customer.map(p=> p.name))         
        ,{id:1} );