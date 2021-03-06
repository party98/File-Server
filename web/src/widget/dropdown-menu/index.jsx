import React from 'react';
import PropTypes from 'prop-types';

import './index.less'

import {Menu} from '../menu'

import {cls} from "../../util/"

export default class DropdownMenu extends React.Component {
displayName: "DropdownMenu";

    constructor(props) {
        super(props);
        this.interval = null;

        this.state = {
            open: false,
        };
    }

    toggleOpen() {
        this.setState({
            open: !this.state.open,
            selected: this.state.selected,
            value: this.state.value
        })
    }

    componentWillReceiveProps(props) {

        var selected = props.selected
        this.setState({
            open: false,
            value: props.items[selected]
        });

    }

    componentDidMount() {
        var selected = this.props.selected
        this.setState({
            open: false,
            selected: this.props.selected,
            value: this.props.items[selected]
        });
    }

    setSelected(index) {
        this.setState({
            open: false,
            selected: index,
            value: this.props.items[index]
        });

        if (this.props.onChange != null) {
            this.props.onChange(index);
        }
    }

    render() {
        var _this = this;

        var MenuItem = Menu.Item;

        var elements = (
            <div className={cls(this, "button", {open: this.state.open})} onClick={this.toggleOpen.bind(this)}>
                {this.state.value}
                <div className={cls(this, "arrow", {open: this.state.open})}>
                    ▼
                </div>
            </div>
        );

        if (this.state.open) {

            elements = (
                <Menu
                  className={cls(this, "menu")}
                  selectedIndex={[this.state.selected]}
                  items={this.props.items.map((item, index) => new MenuItem(item, "", function() {_this.setSelected(index)}))}
                  onMouseLeave={function() {
                    _this.state.open = true;
                    _this.toggleOpen();
                }}
                fit_content>
                    {elements}
                </Menu>
            );
        }

        return (
            <div>
                <label>
                    {this.props.label}
                </label>
                {elements}
            </div>
        );
    }

}
DropdownMenu.propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string,
    nav: PropTypes.bool,
    onChange: PropTypes.func,
    selected: PropTypes.number
};

DropdownMenu.defaultProps = {
    className: "",
    label: "",
    nav: false,
    onChange: () => {},
    selected: 0
}
