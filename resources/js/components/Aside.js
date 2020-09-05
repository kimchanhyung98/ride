import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '@/actions/user.js';
import storage from '@/lib/storage.js';

const mapStateToProps = (state) => ({
    state
});

class Aside extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenu: false
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick() {
        this.props.handleAside(false);
    }

    handleLogout(e) {
        e.preventDefault();
        const { dispatch } = this.props;

        dispatch(logout());
        alert('로그아웃 되었습니다.');
        this.handleMenuClick();
        this.props.history.push('/');
    }

    render() {
        let user = this.props.state.user.user;
        let isLoggedIn = this.props.state.user.isLoggedIn;

        return (
            <aside className={`aside ${this.props.showAside ? 'show' : ''}`}>
                <div className="top-area">
                    <button type="button" className="btn-aside-close"
                        onClick={this.handleMenuClick}>닫기</button>
                </div>

                <div className="user-info-area">
                    <img src="/images/global/default_profile.png" className="user-profile" alt="프로필 이미지" />
                    <p className="user-name">
                        { isLoggedIn ? `${user.name} 님` : '비로그인' }
                    </p>
                </div>

                <nav className="nav-area">
                    { isLoggedIn ?
                        <ul className="nav-list">
                            <li><Link to="/" onClick={this.handleMenuClick}>메인</Link></li>
                            <li><Link to="/ride/create" onClick={this.handleMenuClick}>라이드 개설</Link></li>
                            <li><Link to="/account/attend" onClick={this.handleMenuClick}>신청내역</Link></li>
                            <li><Link to="/account/create" onClick={this.handleMenuClick}>개설내역</Link></li>
                        </ul>
                        :
                        <ul className="nav-list">
                            <li><Link to="/" onClick={this.handleMenuClick}>메인</Link></li>
                            <li><Link to="/login" onClick={this.handleMenuClick}>로그인</Link></li>
                            <li><Link to="/register" onClick={this.handleMenuClick}>회원가입</Link></li>
                        </ul>
                    }
                </nav>

                <div className="btn-area">
                    { isLoggedIn ?
                        <button type="button" className="btn-logout"
                            onClick={this.handleLogout}>로그아웃</button>
                        :
                        <Link to="/login" className="btn-login"
                            onClick={this.handleMenuClick}>로그인</Link>
                    }
                </div>
            </aside>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Aside));
