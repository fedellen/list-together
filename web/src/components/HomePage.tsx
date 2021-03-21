import LandingVideo from './shared/LandingVideo';
import SignInButton from './shared/SignInButton';
import HomePageIllustration from './svg/list/HomePageIllustration';
import TeamIllustration from './svg/list/TeamIllustration';
import GitHubIcon from './svg/social/GitHubIcon';
import KofiIcon from './svg/social/KofiIcon';

/** Landing page for visitors while not logged in */

export default function HomePage() {
  return (
    <div id="home">
      <section id="landing">
        <HomePageIllustration />
        <div className="flex flex-col justify-center">
          <h1>Sharable Grocery List App For Families</h1>
          <p>
            List Together is a simple, modern list app built with sharing
            capabilities. Completely free to use and{' '}
            <a
              className="home-link"
              href="https://github.com/fedellen/list-together"
            >
              open source.
            </a>
          </p>
          <span className="text-label mb-2 ml-2 mt-8 lg:mt-12 xl:mt-16">
            Easy Login / Sign up :
          </span>
          <div className="flex flex-wrap">
            <SignInButton type="google" />
            <SignInButton type="twitter" />
            <SignInButton type="facebook" />
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="home-content">
          <LandingVideo
            width="320"
            src="/media/list-together-landing-1.mp4"
            ariaLabel="List management features"
          />

          <div>
            <h2>Simple, modern, functional.</h2>
            <p>
              List Together provides an easy to use interface to create and
              manage your lists. Clicking or tapping on items will allow users
              to add, strike, and delete item&rsquo;s from their list. Most list
              actions are stored locally to be used in undo functionality.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="home-content space-x-0">
          <LandingVideo
            width="640"
            src="/media/list-together-landing-2.mp4"
            ariaLabel="List sharing features"
          />
          <div className="xl:order-first xl:pr-24">
            <h2>Share and Collaborate</h2>
            <p>
              Users can easily share their lists with friends or family via
              email address. The shared user must have an account already
              created for server to accept it as a sharable email address.
              Owners of a list can choose to limit the privileges they want that
              shared user to have.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-alt">
        <div className="home-content xl:gap-24">
          <LandingVideo
            width="400"
            src="/media/list-together-landing-3.mp4"
            ariaLabel="Smart list features"
          />
          <div>
            <h2>Convenient Smart Features</h2>
            <p>
              Every list contains a history of items added and removed to be
              used in that list&rsquo;s Auto Complete and Smart Sort features.
              By default, the Smart Sort option will try to sort your list into
              the route you take through the store. Alternatively you can save
              your own order for each item by sorting your list manually then
              using the Save Order option located in the header menu.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="home-content">
          <div>
            <h2>Easy Login / Sign-up</h2>
            <p>
              Not another account to create, no passwords to remember. Simply
              login with your preferred social media provider. There are no
              marketing emails attached to this service, no mailing lists to opt
              out of.{' '}
            </p>
          </div>
          <div className="flex flex-wrap flex-shrink-0 items-center justify-items-center mt-16">
            <SignInButton type="google" />
            <SignInButton type="twitter" />
            <SignInButton type="facebook" />
          </div>
        </div>
      </section>

      <section className="bg-alt">
        <div className="home-content xl:space-x-0">
          <div>
            <h2>Open Source</h2>
            <p>
              List Together is free to use and it&rsquo;s code is open source on
              GitHub under the MIT license. Contributions to the project and
              forks are more than welcome. Information on how to contribute can
              be found at the{' '}
              <a
                className="home-link"
                href="https://github.com/fedellen/list-together"
              >
                project&rsquo;s repo.
              </a>{' '}
              You can support the project or help us pay server costs by{' '}
              <a
                className="home-link"
                href="https://ko-fi.com/pixelpajamastudios"
              >
                tipping us a Ko-fi
              </a>
              .
            </p>
          </div>
          <div className="flex justify-around flex-shrink-0 mt-12 sm:mt-16 md:mt-24 xl:order-first xl:mt-0 ">
            <div className="w-20 sm:w-24 hover-grow xl:mx-24">
              <a href="https://ko-fi.com/pixelpajamastudios">
                <KofiIcon />
              </a>
            </div>
            <div className="w-20 sm:w-24 hover-grow xl:order-first">
              <a href="https://github.com/fedellen/list-together">
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="home-content">
          <div>
            <h2>About Pixel Pajama Studios</h2>
            <p>
              Pixel Pajama Studios is a tiny indie design and development studio
              based in Minnesota, USA. Co-Founders{' '}
              <a
                href="https://pixelpajamastudios.com/abonbon.html"
                className="home-link"
              >
                Bonnie K Thompson (abonbon)
              </a>{' '}
              and{' '}
              <a
                href="https://pixelpajamastudios.com/fedellen.html"
                className="home-link"
              >
                Derek R Sonnenberg (fedellen)
              </a>{' '}
              began their pixel art journey in mid-2018. The idea to turn their
              art into games emerged shortly after. Pixel Pajama Studios has
              released two indie games:{' '}
              <a
                href="https://pixelpajamastudios.com/astraldefense.html"
                className="home-link"
              >
                Astral Defense,{' '}
              </a>
              and{' '}
              <a
                href="https://pixelpajamastudios.com/sonarsmash.html"
                className="home-link"
              >
                Sonar Smash.
              </a>{' '}
            </p>
          </div>
          <div className="team-illustration">
            <TeamIllustration />
          </div>
        </div>
      </section>
      {/* <a className="text-gray-500 font-semibold text-link cursor-pointer underline text-sm mb-8 sm:mb-12 md:mb-16 lg:mb-24 flex justify-center text-center ">
        List Together
        <br /> Press Kit
      </a> */}
    </div>
  );
}
