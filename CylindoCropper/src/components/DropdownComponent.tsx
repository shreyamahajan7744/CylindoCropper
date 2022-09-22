import React from "react";

interface IDropdownProps {
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  name: string;
  selected: string;
  data: { value: string; name: string }[];
}

class DropdownComponent extends React.Component<IDropdownProps> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="select">
        <select
          onChange={this.props.onChange}
          name={this.props.name}
          value={this.props.selected}
          id="orientation"
        >
          {this.props.data.map((data) => {
            return (
              <option value={data.value} key={data.value}>
                {data.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
export default DropdownComponent;
