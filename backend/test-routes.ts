import routes from './src/routes/index';

console.log('=== Routes Debug ===');
console.log('Routes type:', typeof routes);
console.log('Has stack:', !!routes.stack);
console.log('Stack length:', routes.stack?.length);
console.log('');

routes.stack?.forEach((layer: any, i: number) => {
  if (layer.name === 'router') {
    console.log('Sub-router', i);
    console.log('  Regexp:', layer.regexp?.toString());
    console.log('  Handle:', layer.handle?.name);
    if (layer.handle?.stack) {
      console.log('  Sub-routes:', layer.handle.stack.length);
      layer.handle.stack.forEach((subLayer: any, j: number) => {
        if (subLayer.route) {
          console.log('    [' + j + ']', subLayer.route.path, Object.keys(subLayer.route.methods));
        }
      });
    }
  } else if (layer.route) {
    console.log('Route', i, 'path:', layer.route.path, 'methods:', Object.keys(layer.route.methods));
  }
});
