export default () => {
  const displayOptions = {
    full: 'u-md-sizeFull',
    wide: 'u-md-size2of3',
    half: 'u-md-size1of2',
    narrow: 'u-md-size1of3',
  };

  const getDisplayOption = (value) => {
    const keys = Object.keys(displayOptions);
    const values = Object.values(displayOptions);

    for (let i = 0; i < keys.length; i += 1) {
      if (value === keys[i]) {
        return values[i];
      }
    }
    return null;
  }

  return {
    displayOptions,
    getDisplayOption
  }
}
