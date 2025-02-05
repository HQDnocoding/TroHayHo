class URLBuilder {
    constructor(baseUrl = '/post-parent/') {
      this.baseUrl = baseUrl;
      this.params = new URLSearchParams();
    }
  
    min_price(value) {
      if (value) this.params.set('min_price', value);
      return this;
    }
  
    max_price(value) {
      if (value) this.params.set('max_price', value);
      return this;
    }
  
    min_acreage(value) {
      if (value) this.params.set('min_acreage', value);
      return this;
    }
  
    max_acreage(value) {
      if (value) this.params.set('max_acreage', value);
      return this;
    }
  
    type(value) {
      if (value) this.params.set('type', value);
      return this;
    }
  
    province_code(value) {
      if (value) this.params.set('province_code', value);
      return this;
    }
  
    district_code(value) {
      if (value) this.params.set('district_code', value);
      return this;
    }
  
    ward_code(value) {
      if (value) this.params.set('ward_code', value);
      return this;
    }
  
    kw_title(value) {
      if (value) this.params.set('kw_title', value);
      return this;
    }
    is_newest(value) {
        if (value!==null) this.params.set('is_newest', value);
        return this;
      }
    number_people(value){
      if (value) this.params.set('number_people', value);
      return this;
    }
    build() {
      const queryString = this.params.toString();
      return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    }
  }
  
  export const endpointsDucFilter = new URLBuilder();