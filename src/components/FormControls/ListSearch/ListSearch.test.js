import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'

import {ListSearch} from './ListSearch.component'

describe('ListSearch component', () => {
  let wrapper
  let props = {
    value: '',
    itemsList: [
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
    ],
    onSelect: jest.fn(),
  }

  beforeEach(() => {
    props.onSelect.mockClear()
  })

  it('should render Dropdown component', () => {
    wrapper = mount(<ListSearch {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render text box to hold selected item', () => {
    wrapper = mount(<ListSearch {...props} />)
    expect(wrapper.find('input[type="text"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should set initial value', () => {
    const localProps = {
      ...props,
      value: 3,
    }
    wrapper = mount(<ListSearch {...localProps} />)
    expect(wrapper.find('input[type="text"]').props().defaultValue).toBe(
      'three',
    )
    wrapper.unmount()
  })

  it('should show dropdown menu on focus', () => {
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('input[type="text"]')
      .first()
      .simulate('focus')
    expect(wrapper.find('button.item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should hide dropdown menu on blur', done => {
    jest.useFakeTimers()
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('input[type="text"]')
      .first()
      .simulate('focus')
    expect(wrapper.find('button.item')).toHaveLength(3)
    wrapper
      .find('input[type="text"]')
      .first()
      .simulate('blur')

    act(() => {
      jest.runAllTimers()
      setImmediate(() => {
        wrapper.update()
        expect(wrapper.find('button.item')).toHaveLength(0)
        done()
      })
    })

    jest.useRealTimers()
    wrapper.unmount()
  })

  it('should show dropdown menu on icon click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should do nothing if menu open and clicked again', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(3)

    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(3)

    wrapper.unmount()
  })

  it('should call onSelect on item click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')
    expect(menuItems).toHaveLength(3)

    menuItems.at(2).simulate('click', event)
    expect(props.onSelect).toHaveBeenCalledTimes(1)
    expect(props.onSelect.mock.calls[0][0]).toMatchObject({
      index: 2,
      item: {label: 'three', value: 3},
    })
    wrapper.unmount()
  })

  it('should call onSelect with down arrow navigation and enter', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')
    expect(menuItems).toHaveLength(3)

    const input = wrapper.find('input[type="text"]')
    input.simulate('keyUp', {...event, key: 'ArrowDown'})
    input.simulate('keyUp', {...event, key: 'ArrowDown'})
    input.simulate('keyUp', {...event, key: 'Enter'})

    expect(props.onSelect).toHaveBeenCalledTimes(1)
    expect(props.onSelect.mock.calls[0][0]).toMatchObject({
      index: 1,
      item: {label: 'two', value: 2},
    })
    wrapper.unmount()
  })

  it('should call onSelect up arrow navigation and enter', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} value="three" />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')
    expect(menuItems).toHaveLength(3)

    const input = wrapper.find('input[type="text"]')
    input.simulate('keyUp', {key: 'ArrowUp'})
    input.simulate('keyUp', {key: 'ArrowUp'})
    input.simulate('keyUp', {key: 'Enter'})

    expect(props.onSelect).toHaveBeenCalledTimes(1)
    expect(props.onSelect.mock.calls[0][0]).toMatchObject({
      index: 0,
      item: {label: 'one', value: 1},
    })
    wrapper.unmount()
  })

  it('should close menu on escape click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} value="three" />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')
    expect(menuItems).toHaveLength(3)

    const input = wrapper.find('input[type="text"]')
    input.simulate('keyUp', {key: 'ArrowUp'})
    input.simulate('keyUp', {key: 'Escape'})

    expect(wrapper.find('button.item')).toHaveLength(0)
    expect(props.onSelect).toHaveBeenCalledTimes(0)
    wrapper.unmount()
  })

  it('should add label div to show selected item', () => {
    wrapper = mount(<ListSearch {...props} value="three" />)
    expect(wrapper.find('[data-dom-id="label"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="label"]').text()).toBe('three')
    wrapper.unmount()
  })

  it('should show menu on label click and hide label', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} value="three" />)
    wrapper.find('[data-dom-id="label"]').simulate('click', event)
    expect(wrapper.find('.list')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="label"]')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should update label text on item selection', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')

    menuItems.at(1).simulate('click', event)
    expect(wrapper.find('[data-dom-id="label"]').text()).toBe('two')
    wrapper.unmount()
  })

  it('should clear input text if menu is open', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)

    expect(wrapper.find('input').text()).toBe('')
    wrapper.unmount()
  })

  it('should show filtered item if user type in input box', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearch {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)

    const input = wrapper.find('input[type="text"]')
    input.simulate('keyUp', {target: {value: 'two'}})
    expect(wrapper.find('button.item')).toHaveLength(1)
    expect(
      wrapper
        .find('button.item')
        .at(0)
        .text(),
    ).toBe('two')
    wrapper.unmount()
  })
})
