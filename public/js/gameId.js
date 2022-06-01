//generate random string for game id and check it is unique

async function generateId() {
  while (true) {
    let newId =
      Math.random().toString(36).substring(2, 6) +
      Math.random().toString(36).substring(2, 6);
    // console.log(newId);
    return fetch(`/testId/${newId}`, {
      method: "GET",
    }).then((res) => {
      console.log(res);
      if (res === false) {
        console.log(newId);
        return newId;
      }
    });
  }
  //   while (true) {
  //     let newId =
  //       Math.random().toString(36).substring(2, 6) +
  //       Math.random().toString(36).substring(2, 6);
  //     console.log(newId);
  //     res = await fetch(`/testId/${newId}`, {
  //       method: "GET",
  //     });
  //     if (res == false) {
  //       return newId;
  //     }
  //   }
}
