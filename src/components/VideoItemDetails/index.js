import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import {formatDistanceToNow} from 'date-fns'
import {BiDislike, BiLike} from 'react-icons/bi'
import {BsDot} from 'react-icons/bs'
import {MdPlaylistAdd} from 'react-icons/md'
import Header from '../Header'
import NavbarMedium from '../NavbarMedium'
import NxtWatchContext from '../../context/NxtWatchContext'
import {
  LoadingContainer,
  NoVideosDescription,
  NoVideosImage,
  NoVideosTitle,
  RetryButton,
  NoVideosViewContainer,
} from '../Home/styledComponents'
import {
  VideoItemDetailsResponsiveContainer,
  VideoItemDetailsContainer,
  VideoTitle,
  RowAlign,
  VideoDetails,
  VideoPublishedDate,
  VideoViewCount,
  LikeButton,
  LikeText,
  DisLikeText,
  SaveText,
  IconContainer,
  VideoChannelThumbnail,
  VideoChannelContainer,
  ChannelDescription,
  ChannelName,
  ChannelSubs,
  ChannelDetailsContainer,
} from './styledComponents'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'INPROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    videoDetails: '',
    responseStatus: apiStatus.initial,
    likeClicked: false,
    dislikeClicked: false,
    saveClicked: false,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    this.setState({responseStatus: apiStatus.loading})
    const jwtToken = Cookie.get('jwt_token')
    const {match} = this.props
    const {params} = match

    const {id} = params
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const video = data.video_details

      const publishedDate = formatDistanceToNow(
        new Date(video.published_at),
      ).slice(-7)

      const formattedData = {
        channelName: video.channel.name,
        channelProfileImage: video.channel.profile_image_url,
        subs: video.channel.subscriber_count,
        description: video.description,
        id: video.id,
        thumbnailUrl: video.thumbnail_url,
        publishedAt: publishedDate,
        title: video.title,
        videoUrl: video.video_url,
        viewCount: video.view_count,
      }

      this.setState({
        videoDetails: formattedData,
        responseStatus: apiStatus.success,
      })
    } else {
      this.setState({responseStatus: apiStatus.failure})
    }
  }

  onClickDisLike = () => {
    const {likeClicked, dislikeClicked} = this.state
    if (likeClicked) {
      this.setState({likeClicked: false, dislikeClicked: true})
    } else {
      this.setState({dislikeClicked: true})
    }
    if (dislikeClicked) {
      this.setState({dislikeClicked: false})
    }
  }

  onClickLike = () => {
    const {likeClicked, dislikeClicked} = this.state
    if (dislikeClicked) {
      this.setState({likeClicked: true, dislikeClicked: false})
    } else {
      this.setState({likeClicked: true})
    }
    if (likeClicked) {
      this.setState({likeClicked: false})
    }
  }

  renderVideoDetails = () => (
    <NxtWatchContext.Consumer>
      {value => {
        const {saveVideo, darkTheme} = value
        const {
          videoDetails,
          saveClicked,
          likeClicked,
          dislikeClicked,
        } = this.state
        const {
          id,
          thumbnailUrl,
          channelName,
          description,
          publishedAt,
          viewCount,
          title,
          videoUrl,
          channelProfileImage,
          subs,
        } = videoDetails
        const IconColor = darkTheme ? '#cbd5e1' : '#475569'

        const onClickSave = () => {
          const SaveVideoDetails = {
            thumbnailUrl,
            id,
            channelName,
            viewCount,
            publishedAt,
            title,
          }
          this.setState(prevState => ({saveClicked: !prevState.saveClicked}))
          saveVideo(SaveVideoDetails)
        }

        return (
          <VideoItemDetailsContainer darkTheme={darkTheme}>
            <ReactPlayer controls width="100%" url={videoUrl} />
            <VideoTitle darkTheme={darkTheme}>{title}</VideoTitle>
            <VideoDetails>
              <RowAlign>
                <VideoViewCount darkTheme={darkTheme}>
                  {viewCount} views
                </VideoViewCount>
                <BsDot
                  color={darkTheme ? '#cbd5e1' : '#475569'}
                  fontSize={20}
                />
                <VideoPublishedDate darkTheme={darkTheme}>
                  {publishedAt} ago
                </VideoPublishedDate>
              </RowAlign>
              <RowAlign>
                <IconContainer>
                  <LikeButton
                    onClick={this.onClickLike}
                    id="like"
                    type="button"
                  >
                    <BiLike
                      color={likeClicked ? '#2563eb' : IconColor}
                      fontSize={16}
                    />
                  </LikeButton>
                  <LikeText
                    darkTheme={darkTheme}
                    likeClicked={likeClicked}
                    htmlFor="like"
                  >
                    Like
                  </LikeText>
                </IconContainer>
                <IconContainer>
                  <LikeButton
                    onClick={this.onClickDisLike}
                    id="dislike"
                    type="button"
                  >
                    <BiDislike
                      color={dislikeClicked ? '#2563eb' : IconColor}
                      fontSize={16}
                    />
                  </LikeButton>
                  <DisLikeText
                    darkTheme={darkTheme}
                    dislikeClicked={dislikeClicked}
                    htmlFor="dislike"
                  >
                    Dislike
                  </DisLikeText>
                </IconContainer>
                <IconContainer>
                  <LikeButton onClick={onClickSave} id="save" type="button">
                    <MdPlaylistAdd
                      color={saveClicked ? '#2563eb' : IconColor}
                      fontSize={16}
                    />
                  </LikeButton>
                  <SaveText
                    darkTheme={darkTheme}
                    saveClicked={saveClicked}
                    htmlFor="save"
                  >
                    {saveClicked ? 'Saved' : 'Save'}
                  </SaveText>
                </IconContainer>
              </RowAlign>
            </VideoDetails>

            <VideoChannelContainer>
              <VideoChannelThumbnail src={channelProfileImage} />
              <ChannelDetailsContainer>
                <ChannelName darkTheme={darkTheme}>{channelName}</ChannelName>
                <ChannelSubs darkTheme={darkTheme}>
                  {subs} subscribers
                </ChannelSubs>
                <ChannelDescription darkTheme={darkTheme}>
                  {description}
                </ChannelDescription>
              </ChannelDetailsContainer>
            </VideoChannelContainer>
          </VideoItemDetailsContainer>
        )
      }}
    </NxtWatchContext.Consumer>
  )

  renderLoadingView = darkTheme => (
    <LoadingContainer data-testid="loader">
      <Loader
        type="ThreeDots"
        color={darkTheme ? '#ffffff' : '#181818'}
        height="50"
        width="50"
      />
    </LoadingContainer>
  )

  renderFailureView = darkTheme => (
    <NoVideosViewContainer>
      <NoVideosImage
        src={
          darkTheme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
        }
      />
      <NoVideosTitle darkTheme={darkTheme}>
        Oops! Something Went Wrong
      </NoVideosTitle>
      <NoVideosDescription darkTheme={darkTheme}>
        We are having some trouble to complete your request. Please try again.
      </NoVideosDescription>
      <RetryButton onClick={() => this.getVideoDetails()} type="button">
        Retry
      </RetryButton>
    </NoVideosViewContainer>
  )

  renderData = darkTheme => {
    const {responseStatus} = this.state
    switch (responseStatus) {
      case apiStatus.success:
        return this.renderVideoDetails(darkTheme)
      case apiStatus.loading:
        return this.renderLoadingView(darkTheme)
      case apiStatus.failure:
        return this.renderFailureView(darkTheme)
      default:
        return null
    }
  }

  render() {
    return (
      <NxtWatchContext.Consumer>
        {value => {
          const {darkTheme} = value
          return (
            <>
              <Header />
              <VideoItemDetailsResponsiveContainer>
                <NavbarMedium />
                {this.renderData(darkTheme)}
              </VideoItemDetailsResponsiveContainer>
            </>
          )
        }}
      </NxtWatchContext.Consumer>
    )
  }
}

export default VideoItemDetails
