/*
 *
 * Statistics
 *
 */

export class Statistics {
  constructor(store) {
    this.store = store;
    store.subscribe(this.storeListener.bind(this));
  }

  storeListener() {
    const state = this.store.getState();
    this.currentValue = state.currentValue;
  }

  computeStatistics(input, categories) {
    const classifications = categories.map((category) => {
      const count = category.startsWith('a') ? 0 : 1;
      return { name: category, count };
    });
    input.forEach((item) => {
      classifications.abc.count += item.count;
    });
    return classifications;
  }
}
