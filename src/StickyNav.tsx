// src/StickyNav.tsx
import CustomNav from './components/CustomNav';
import {Component} from "react";

class StickyNav extends Component<{ children: any }> {
    render() {
        const {children} = this.props;
        return (
            <>
                <CustomNav/>
                {children}
            </>
        );
    }
}

export default StickyNav;