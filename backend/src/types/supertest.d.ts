declare module 'supertest' {
  function request(app: any): any;
  namespace request {}
  export = request;
} 