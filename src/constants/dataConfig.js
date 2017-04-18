const dataConfig = {
  primaryKeyFields: ['measure', 'risk', 'type', 'location'],
  seriesKeyFields: [
    {
      key: 'year',
      model: 'randomModel',
    },
  ],
  dataKeyField: {
    key: 'mean',
    uncertainty: ['mean_lb', 'mean_ub'],
  },
};

export default dataConfig;
