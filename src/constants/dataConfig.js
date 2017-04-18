const dataConfig = {
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

export default dataConfig;
