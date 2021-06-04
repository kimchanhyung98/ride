import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import { RenderAfterNavermapsLoaded } from "react-naver-maps";
import DatePicker from 'react-date-picker';

// helper
import { formatDate, formatNaturalDate, getTime } from '@/utils/dateFormat';
import { handleChange } from '@/utils/form';
import { timeOptions, difficultyOptions, altitudeOptions } from '@/utils/option';

// component
import Map from '@/components/map/Map';
import File from '@/components/common/File';
import Selectbox from '@/components/common/Selectbox';

// scss
import '@sass/pages/ride/ride-create.scoped.scss';

const mapStateToProps = (state) => ({
    state
});

class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id,

            ride: {
                file: {
                    name: ''
                },
                file_id: '',
                name: '',
                description: '',
                started_at: '',
                ended_at: '',

                address: '',
                address_detail: '',
                locality: '',
                sublocality1: '',
                sublocality2: '',
                latitude: '37.554722',
                longitude: '126.970833',

                difficulty: 'beginner',
                capacity: '',
                distance: '',
                altitude: 'flat',
                altitude_detail: '',
            },

            started_date: new Date(),
            started_time: '00:00',
            ended_date: new Date(),
            ended_time: '00:00',

            timeOptions: [],
            difficultyOptions: [],
            altitudeOptions: [],
            isLoading: false
        };

        this.handleSetMarker = this.handleSetMarker.bind(this);
        this.handleSetFile = this.handleSetFile.bind(this);
        this.handleSetAddress = this.handleSetAddress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getData = this.getData.bind(this);
    }

    handleSetMarker(latitude, longitude) {
        let nextState = {
            latitude: latitude,
            longitude: longitude
        };

        this.setState(prevState => ({
            ride: {
                ...prevState.ride,
                ...nextState
            }
        }));

        this.handleSetAddress(latitude, longitude);
    }

    handleSetFile(file) {
        let nextState = {
            file: file,
            file_id: file.id
        };

        this.setState(prevState => ({
            ride: {
                ...prevState.ride,
                ...nextState
            }
        }));
    }

    handleSetAddress(latitude, longitude) {
        let lnglat = `${longitude},${latitude}`;

        axios.get(`/api/reverse-geocode?lnglat=${lnglat}`).then(res => {
            let data = res.data.results[0].region;

            this.setState(prevState => ({
                ride: {
                    ...prevState.ride,
                    address: `${data.area1.name} ${data.area2.name} ${data.area3.name}`,
                    locality: data.area1.name,
                    sublocality1: data.area2.name,
                    sublocality2: data.area3.name
                }
            }));
        }).catch(err => {
            console.log(err);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.state.isLoading) {
            return false;
        }

        let started_at = formatDate(this.state.started_date, this.state.started_time);
        let ended_at = formatDate(this.state.ended_date, this.state.ended_time);

        this.setState(prevState => ({
            ride: {
                ...prevState.ride,
                started_at: started_at,
                ended_at: ended_at,
            },
            isLoading: true
        }), () => {
            axios.put(`/api/ride/${this.state.id}`, this.state.ride).then(res => {
                alert(res.data.message);
                this.props.history.push(`/ride/${res.data.ride_id}`);
            }).catch(err => {
                if (err.response.status == 422) {
                    const messages = err.response.data.errors;
                    alert(messages[Object.keys(messages)[0]]);
                } else {
                    alert('오류');
                }

                this.setState({
                    isLoading: false
                });
            });
        });
    }

    getData() {
        axios.get(`/api/ride/edit/${this.state.id}`).then(res => {
            let data = res.data.ride;
            let nextState = {
                started_date: formatNaturalDate(data.started_at),
                started_time: getTime(data.started_at),
                ended_date: formatNaturalDate(data.ended_at),
                ended_time: getTime(data.ended_at)
            }

            this.setState(prevState => ({
                ride: {
                    ...prevState.ride,
                    ...res.data.ride
                },
                ...nextState
            }));
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.setState({
            timeOptions: timeOptions(),
            difficultyOptions: difficultyOptions(),
            altitudeOptions: altitudeOptions()
        });

        //  TODO: 추후 getdata 오류 수정
        setTimeout(this.getData, 0);
    }

    render() {
        const NAVER_API_KEY = env.NCLOUD_CLIENT_ID;

        return (
            <main className="main">
                <section className="create-container">
                    <form onSubmit={ this.handleSubmit }>
                        <div className="form-group ride-name">
                            <label className="form-label required">제목</label>

                            <input type="text"
                                name="name"
                                value={this.state.ride.name || ''}
                                placeholder="내용을 입력해주세요"
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />
                        </div>

                        <div className="form-group ride-description">
                            <label className="form-label required">설명</label>

                            <textarea name="description"
                                value={ this.state.ride.description || '' }
                                placeholder="내용을 입력해주세요"
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }}></textarea>
                        </div>

                        {/* 시작 종료 시간 설정 */}
                        <div className="form-group ride-date">
                            <label className="form-label required">시작 시간</label>

                            <DatePicker
                                format={'y-MM-dd'}
                                value={ this.state.started_date }
                                onChange={(value) => {
                                    this.setState({
                                        started_date: value
                                    })
                                }} />

                            <Selectbox
                                value={ this.state.started_time }
                                options={ this.state.timeOptions }
                                handleSetData={ e => {
                                    this.setState({
                                        started_time: e.target.value
                                    });
                                }} />
                        </div>

                        <div className="form-group ride-date">
                            <label className="form-label">종료 시간</label>

                            <DatePicker
                                format={'y-MM-dd'}
                                value={ this.state.ended_date }
                                onChange={(value) => {
                                    this.setState({
                                        ended_date: value
                                    })
                                }} />

                            <Selectbox
                                value={ this.state.ended_time }
                                options={ this.state.timeOptions }
                                handleSetData={ e => {
                                    this.setState({
                                        ended_time: e.target.value
                                    });
                                }} />
                        </div>

                        <div className="form-group ride-address">
                            <label className="form-label required">장소</label>

                            <input type="text"
                                name="address"
                                value={ this.state.ride.address || '' }
                                placeholder="장소를 지도에 표시해주세요"
                                readOnly
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />

                            <RenderAfterNavermapsLoaded
                                ncpClientId={ NAVER_API_KEY }
                                error={<p>오류</p>}
                                loading={<p>Loading</p>}>
                                <Map width={'100%'}
                                   height={'300px'}
                                   disabled={false}
                                   zoom={12}
                                   center={{
                                       lat: this.state.ride.latitude,
                                       lng: this.state.ride.longitude

                                   }}
                                   markers={[
                                       {
                                           lat: this.state.ride.latitude,
                                           lng: this.state.ride.longitude
                                       }
                                   ]}
                                   handleSetMarker={ this.handleSetMarker } />
                            </RenderAfterNavermapsLoaded>

                            <input type="text"
                                name="address_detail"
                                value={ this.state.ride.address_detail || '' }
                                placeholder="상세 장소를 입력해주세요"
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />
                        </div>

                        <div className="form-group ride-course">
                            <label className="form-label">코스</label>

                            <File value={ this.state.ride.file_id || '' }
                                placeholder={'GPX 파일을 업로드해주세요'}
                                url={'/api/upload/gpx'}
                                file={ this.state.ride.file }
                                handleSetFile={ this.handleSetFile } />
                        </div>

                        <div className="form-group ride-difficulty">
                            <label className="form-label required">난이도</label>

                            <Selectbox
                                value={ this.state.ride.difficulty }
                                options={ this.state.difficultyOptions }
                                handleSetData={ e => {
                                    let value = e.target.value;
                                    this.setState(prevState => ({
                                        ride: {
                                            ...prevState.ride,
                                            difficulty: value
                                        }
                                    }));
                                }} />
                        </div>

                        <div className="form-group ride-capacity">
                            <label className="form-label required">정원</label>

                            <input type="number"
                                name="capacity"
                                value={ this.state.ride.capacity || '' }
                                placeholder="3~30 사이 숫자만 입력해 주세요"
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />
                        </div>

                        <div className="form-group ride-distance">
                            <label className="form-label">거리</label>

                            <input type="number"
                                name="distance"
                                placeholder="숫자만 입력해 주세요"
                                value={ this.state.ride.distance || '' }
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />
                        </div>

                        <div className="form-group ride-altitude">
                            <label className="form-label required">고도</label>

                            <Selectbox
                                value={ this.state.ride.altitude }
                                options={ this.state.altitudeOptions }
                                handleSetData={ e => {
                                    let value = e.target.value;
                                    this.setState(prevState => ({
                                        ride: {
                                            ...prevState.ride,
                                            altitude: value
                                        }
                                    }));
                                }} />

                            <input type="number"
                                name="altitude_detail"
                                value={ this.state.ride.altitude_detail || '' }
                                placeholder="숫자만 입력해 주세요"
                                onChange={ e => {
                                    handleChange(e, this, 'ride')
                                }} />
                        </div>

                        <div className="btn-area">
                            <input type="submit" className="btn-submit" value="코스 수정하기" />
                        </div>
                    </form>
                </section>
            </main>
        );
    }
};

export default connect(mapStateToProps)(Edit);