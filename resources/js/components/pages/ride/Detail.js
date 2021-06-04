import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import storage from '@/utils/storage.js';
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import { formatDifficulty, formatAltitude } from '@/utils/ride';

import Map from '@/components/map/Map';

import '@sass/pages/ride/ride-detail.scoped.scss';

const mapStateToProps = (state) => ({
    state
});

class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,
            ride: {
                user: {}
            },
            participants_count: 0,
            isLoading: false
        };

        this.getData = this.getData.bind(this);
        this.getAttendStatus = this.getAttendStatus.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getData() {
        axios.get(`/api/ride/${this.state.id}`).then(res => {
            this.setState({
                ride: res.data.ride,
                participants_count: res.data.participants_count
            });
        }).catch(err => {
            console.log(err);
        });
    }

    getAttendStatus() {
        axios.get(`/api/status/participation?user_id=${this.state.user.id}&ride_id=${this.state.id}`).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let user = this.props.state.user;

        if (this.state.isLoading) {
            return false;
        }

        if (!user.isLoggedIn) {
            alert('로그인을 해주세요');
            return false;
        }

        this.setState({
            isLoading: true
        }, () => {
            axios.post('/api/ride/attend', {
                user_id: user.user.id,
                ride_id: this.state.id
            }).then(res => {
                this.setState({
                    participants_count: ++this.state.participants_count
                })
                alert(res.data.message);
            }).catch(err => {
                alert('오류');
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const NAVER_API_KEY = env.NCLOUD_CLIENT_ID;
        let ride = this.state.ride;

        return (
            <main className="main">
                <RenderAfterNavermapsLoaded
                    ncpClientId={NAVER_API_KEY}
                    error={<p>오류</p>}
                    loading={''}>
                    <section className="map-container">
                        <Map id={'map'}
                            width={'100%'}
                            height={'360px'}
                            disabled={true}
                            zoom={14}
                            center={{
                                lat: ride.latitude,
                                lng: ride.longitude
                            }}
                            markers={[
                                {
                                    lat: ride.latitude,
                                    lng: ride.longitude
                                }
                            ]} />
                    </section>

                    <section className="main-container">
                        <div className="ride-header">
                            <div className="ride-difficulty">{ formatDifficulty(ride.difficulty) }</div>
                        </div>

                        <div className="ride-content">
                            <div className="content-group ride-title">
                                <h2>{ ride.name }</h2>
                            </div>

                            <ul className="content-group user-info">
                                <li>
                                    <span>개설자</span>
                                    <p>{ ride.user.name }</p>
                                </li>
                                <li>
                                    <span>이메일</span>
                                    <p>{ ride.user.email }</p>
                                </li>
                                <li>
                                    <span>전화번호</span>
                                    <p>{ ride.user.phone }</p>
                                </li>
                            </ul>

                            <ul className="content-group ride-detail">
                                <li>
                                    <span>거리</span>
                                    <p>
                                        { ride.distance ?
                                            `${ride.distance}km` : '미정'
                                        }
                                    </p>
                                </li>
                                <li>
                                    <span>고도</span>
                                    <p>
                                        { formatAltitude(ride.altitude) }
                                        { ride.altitude_detail &&
                                            <span> {ride.altitude_detail}m</span>
                                        }
                                    </p>
                                </li>
                                <li>
                                    <span>시작시간</span>
                                    <p>{ ride.started_at }</p>
                                </li>
                                <li>
                                    <span>종료시간</span>
                                    <p>
                                        { ride.ended_at || '미정' }
                                    </p>
                                </li>
                                <li>
                                    <span>장소</span>
                                    <p>{ ride.address }</p>
                                </li>

                                { ride.address_detail &&
                                    <li>
                                        <span>장소상세</span>
                                        <p>{ ride.address_detail }</p>
                                    </li>
                                }
                            </ul>

                            { ride.file &&
                                <div className='content-group ride-map'>
                                    <Map id={'gpx-map'}
                                        width={'100%'}
                                        height={'360px'}
                                        disabled={true}
                                        zoom={14}
                                        gpx={ ride.file } />

                                    <a href={ride.file.path}
                                        className="btn-download"
                                        download>GPX파일 다운로드</a>
                                </div>
                            }

                            <div className="content-group ride-description">
                                <p>
                                    { ride.description }
                                </p>
                            </div>

                            <div className="content-group ride-capacity">
                                <div>정원 { ride.capacity }명</div>
                                <div>현재 { this.state.participants_count }명 참석</div>
                            </div>
                        </div>

                        <div className="btn-area">
                            <button type="button"
                                className="btn-attend"
                                onClick={ this.handleSubmit }>참가 하기</button>
                        </div>
                    </section>
                </RenderAfterNavermapsLoaded>
            </main>
        );
    }
};

export default connect(mapStateToProps)(Detail);