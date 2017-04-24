const lineDataConfig = {
  primaryKeyFields: ['measure', 'risk', 'type', 'location'],
  seriesKeyFields: [
    {
      key: 'year',
      model: 'randomModel',
      startRange: [100, 1500],
      uncertainty: 50,
    },
  ],
  dataKeyField: {
    key: 'mean',
    uncertainty: ['mean_lb', 'mean_ub'],
  },
};

const mapDataConfig = {
  primaryKeyFields: ['measure', 'risk', 'type', 'year'],
  seriesKeyFields: [
    {
      key: 'location',
      model: 'randomWalk',
      startRange: [100, 150],
      uncertainty: 20,
    },
  ],
  dataKeyField: {
    key: 'mean',
    uncertainty: ['mean_lb', 'mean_ub'],
  },
};

export { lineDataConfig, mapDataConfig };
