// Visit.find({},function(err,visits){
//   // visits.forEach(function(visit){
//   //   //console.log(visit)
//   // })
//   console.log('All visits');
//   console.log(visits.length);
// });

// Visit.find({status:'Completed'},function(err,visits){
//   visits.forEach(function(visit){
//     console.log(visit.statusLog);
//   })
//   console.log('Total completed visits');
//   console.log(visits.length);
// });

// Visit.find({status:'Unconfirmed'},function(err,visits){
//   // visits.forEach(function(visit){
//   //   //console.log(visit)
//   // })
//   console.log('Total unconfirmed visits');
//   console.log(visits.length);
// });

// //Scheduled ones
// Visit.find({'date':{"$gte": moment("April 1st, 2018", "MMM-DD-YYYY").startOf('day'), "$lt": moment("April 14st, 2018", "MMM-DD-YYYY").endOf('day')}}).sort({startTime:1}).exec(function(err,visits){
//   var completedArr = [];
//   var unconfirmedArr = [];
//   var other = [];
//   var falsePositives = [];
//   var actualUnconfirmed = [];

//   visits.forEach(function(visit){
//     //console.log(visit)
//     if(visit.status == 'Completed'){
//       completedArr.push(visit);
//     } else if (visit.status == 'Unconfirmed'){
//       unconfirmedArr.push(visit);
//     } else {
//       other.push(visit)
//     }
//   });
//   console.log('Scheduled visits');
//   console.log(visits.length);

//   console.log('Scheduled completed visits',completedArr.length);
//   console.log('%: ',(completedArr.length/visits.length) * 100);

//   var totalDiscrepancy = 0;
//   var itemsProcessed = 0;
//   completedArr.forEach(function(visit){
//     var discrepancy =  visit.duration - visit.scheduledDuration
//     // console.log(visit.scheduledDuration);
//     // console.log(visit.duration);
//     totalDiscrepancy = totalDiscrepancy + discrepancy;
//     itemsProcessed++;
//     if(itemsProcessed === completedArr.length-1) {
//       console.log('Discrepancy total', totalDiscrepancy);
//     }
//   })



//   console.log('Scheduled unconfirmed visits',unconfirmedArr.length );
//   console.log('%: ',(unconfirmedArr.length/visits.length) * 100 );

//   unconfirmedArr.forEach(function(unconfirmed){
//     if (unconfirmed.clockInTime != null && unconfirmed.clockOutTime != null){
//       falsePositives.push(unconfirmed);
//     } else {
//       actualUnconfirmed.push(unconfirmed);
//       console.log(unconfirmed.statusLog);
//     }
//   })

//   console.log('Scheduled false positives visits',falsePositives.length );
//   console.log('%: ',(falsePositives.length/unconfirmedArr.length) * 100 );

//   console.log('Scheduled actual unconfirmed visits',actualUnconfirmed.length );
//   console.log('%: ',(actualUnconfirmed.length/unconfirmedArr.length) * 100 );

//   console.log('Scheduled other visits: ',other.length);
//   console.log('%: ',(other.length/visits.length) * 100);

// })

// Visit.find({'date':{"$gte": moment("April 15st, 2018", "MMM-DD-YYYY").startOf('day'), "$lt": moment("April 29st, 2018", "MMM-DD-YYYY").endOf('day')}}).sort({startTime:1}).exec(function(err,visits){
//   var completedArr = [];
//   var unconfirmedArr = [];
//   var other = [];
//   var falsePositives = [];
//   var actualUnconfirmed = [];

//   visits.forEach(function(visit){
//     //console.log(visit)
//     if(visit.status == 'Completed'){
//       completedArr.push(visit);
//     } else if (visit.status == 'Unconfirmed'){
//       unconfirmedArr.push(visit);
//     } else {
//       other.push(visit)
//     }
//   })
//   console.log('Non-scheduled visits');
//   console.log(visits.length);

//   console.log('Non-scheduled completed visits',completedArr.length);
//   console.log('%: ',(completedArr.length/visits.length) * 100);

//   console.log('Non-scheduled unconfirmed visits',unconfirmedArr.length );
//   console.log('%: ',(unconfirmedArr.length/visits.length) * 100 );

//   unconfirmedArr.forEach(function(unconfirmed){
//     if (unconfirmed.clockInTime != null && unconfirmed.clockOutTime != null){
//       falsePositives.push(unconfirmed);
//     } else {
//       actualUnconfirmed.push(unconfirmed);
//     }
//   })

//   console.log('Non-scheduled false positives visits',falsePositives.length );
//   console.log('%: ',(falsePositives.length/unconfirmedArr.length) * 100 );

//   console.log('Non-scheduled actual unconfirmed visits',actualUnconfirmed.length );
//   console.log('%: ',(actualUnconfirmed.length/unconfirmedArr.length) * 100 );

//   console.log('Non-scheduled other visits: ',other.length);
//   console.log('%: ',(other.length/visits.length) * 100);
// })


// // Visit.find({'clientName':'Dorothy Hanlon','date':{"$gte": moment("April 1st, 2018", "MMM-DD-YYYY").startOf('day'), "$lt": moment("April 14st, 2018", "MMM-DD-YYYY").endOf('day')}}).sort({startTime:1}).exec(function(err,visits){
// //   console.log(visits);
// //   console.log('Total visits', visits.length)
// // })
