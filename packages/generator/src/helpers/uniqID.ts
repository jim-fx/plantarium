export default (() => {
  let id = Math.random();

  return () => {
    id = id > 0 ? id - Math.random() : id + Math.random();
    return id.toString().split('.')[1];
  };
})();
