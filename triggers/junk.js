/**
 * TODO
 *
 * This is an example from Zapier that does not work.  It doesn't show the
 * secondary control until after we 'continue' and then use the 'edit' link to
 * return.
 *
 * Turns out this is a known bug: https://github.com/zapier/zapier-platform-cli/issues/162
 *
 * If they ever decide to support this properly, we can take advantage by giving users 'filtered' dynamic choices based on previous choices.
 */

module.exports = {
   key: 'dessert',
   noun: 'Dessert',
   display: {
      label: 'Order Dessert',
      description: 'Orders a dessert.'
   },
   operation: {
      inputFields: [
         {key: 'type', required: true, choices: {1: 'cake', 2: 'ice cream', 3: 'cookie'}, altersDynamicFields: true},
         function(z, bundle) {
            if (bundle.inputData.type === '2') {
               return [{key: 'with_sprinkles', type: 'boolean'}];
            }
            return [];
         }
      ],
      perform: function (z, bundle) {return [{id: 1, style: 'italian', directions: 'boil water'}]}
   }
};