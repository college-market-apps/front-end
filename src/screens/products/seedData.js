const user = {
  user1:{
    name: 'gez',
    firebaseId: '1101',
    email:'email@email.com',
    school:'msu',
    createdAt:'date here'
  },
  user2:{
    name: 'gman',
    firebaseId: 'dd-111',
    email:'email2@email.com',
    school:'msu',
    createdAt:'date here'
  },
  user3:{
    name: 'bob',
    firebaseId: 'dssd-111',
    email:'email3@email.com',
    school:'msu',
    createdAt:'date here'
  }
}

const images = {
  images1: [
    {path:require('../../../assets/images/clicker-1.jpg')}
  ],
  images2: [
    {path:require('../../../assets/images/iphone-1.jpg')}
  ],
  images3: [
    {path:require('../../../assets/images/book-2.jpg')}
  ],
  images4: [
    {path:require('../../../assets/images/textbook-1.jpg')}
  ],
  images5: [
    {path:require('../../../assets/images/iphone-2.jpg')}
  ]
}

const productSeed = [
  {
    title: '2020 Clicker',
    description:'I used this class for my chem 314',
    user: user.user1,
    images: images.images1
  },
  {
    title: 'Iphone 11',
    description:'New Iphone 11',
    user: user.user2,
    images: images.images5
  },
  {
    title: 'chem 301',
    description:'chem book for last year',
    user: user.user3,
    images: images.images3
  },{
    title: 'Iphone 11',
    description:'this is an old iphone that i don"t use anymore',
    user: user.user1,
    images: images.images2
  },
  {
    title: 'math 201-2',
    description:'math book for last year',
    user: user.user2,
    images: images.images3
  },
  {
    title: '2020 Clicker',
    description:'I used this class for my chem 314',
    user: user.user1,
    images: images.images1
  },
  {
    title: 'Iphone 11',
    description:'New Iphone 11',
    user: user.user2,
    images: images.images2
  },
  {
    title: 'chem 301',
    description:'chem book for last year',
    user: user.user3,
    images: images.images3
  },{
    title: 'Iphone 11',
    description:'this is an old iphone that i don"t use anymore',
    user: user.user1,
    images: images.images2
  },
  {
    title: 'math 201-2',
    description:'math book for last year',
    user: user.user2,
    images: images.images4
  },
  {
    title: '2020 Clicker',
    description:'I used this class for my chem 314',
    user: user.user1,
    images: images.images1
  },
  {
    title: 'Iphone 11',
    description:'New Iphone 11',
    user: user.user2,
    images: images.images2
  },
  {
    title: 'chem 301',
    description:'chem book for last year',
    user: user.user3,
    images: images.images3
  },{
    title: 'Iphone 11',
    description:'this is an old iphone that i don"t use anymore',
    user: user.user1,
    images: images.images2
  },
  {
    title: 'math 201-2',
    description:'math book for last year',
    user: user.user2,
    images: images.images3
  },
  {
    title: '2020 Clicker',
    description:'I used this class for my chem 314',
    user: user.user1,
    images: images.images1
  },
  {
    title: 'Iphone 11',
    description:'New Iphone 11',
    user: user.user2,
    images: images.images2
  },
  {
    title: 'chem 301',
    description:'chem book for last year',
    user: user.user3,
    images: images.images3
  },{
    title: 'Iphone 11',
    description:'this is an old iphone that i don"t use anymore',
    user: user.user1,
    images: images.images2
  },
  {
    title: 'math 201-2',
    description:'math book for last year',
    user: user.user2,
    images: images.images3
  },
]

export {productSeed}


