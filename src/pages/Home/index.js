import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPriceBRL } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    /*
    Formate o preço aqui. Não formate no render(), pois sempre q renderizar
    vai chamar a função.
    Fique atento! Analise bem se precisa usar uma função dentro do render!
    */

    console.tron.log(response);
    const data = response.data.map((product) => ({
      ...product,
      priceBRL: formatPriceBRL(product.price),
    }));

    this.setState({ products: data });
  }

  handleAddProduct = (id) => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products } = this.state;

    const { amount } = this.props;

    return (
      <ProductList>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceBRL}</span>

            <button
              type="button"
              onClick={() => {
                return this.handleAddProduct(product.id);
              }}
            >
              <div>
                <MdAddShoppingCart size={16} color="#fff" />
                {amount[product.id] || ''}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = (state) => ({
  // Quantidade daquele produto selecionado
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = (dispatch) =>
  // Actions se tornam props
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

Home.propTypes = {
  addToCartRequest: PropTypes.func.isRequired,
};
