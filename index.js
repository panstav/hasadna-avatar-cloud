const got = require('got');

getFeaturedUsers()
	.then(getProfiles)
	.then(markUp)
	.then(console.log)
	.catch(err => console.error(err.stack));

function getFeaturedUsers(){

	return got('http://forum.hasadna.org.il/categories.json', {json:true})
		.then(res => res.body.featured_users);

}

function getProfiles(featuredUsers){

	return Promise.all(featuredUsers.map(user => getProfile(user.username)));

	function getProfile(username){

		return got(`http://forum.hasadna.org.il/users/${username}.json`, {json:true})
			.then(res => parseProfile(res.body));

		function parseProfile(data){

			const size = isLiteralAvatar(data.user.avatar_template)
				? 20
				: data.topics && data.topics.length
				? ((data.badges.length || 0) + 5) * (data.topics.length + 10)
				: 60;

			return {
				name: data.user.name,
				avatar: resolveAvatarSrc(data.user.avatar_template).replace('{size}', size)
			};

			function resolveAvatarSrc(src){
				return isLiteralAvatar(src) ? src : `http://forum.hasadna.org.il${src}`;
			}

		}

		function isLiteralAvatar(src){
			return src.indexOf('discourse.org') > -1;
		}

	}

}

function markUp(users){

	var offset = 0;

	const avatars = users.map(user => {
		return `<div class="avatar" style="${getStyle(randomizeCoordinates())}"><img src="${user.avatar}" title="${user.name}"></div>`
	}).join('');

	return `<div id="avatarage">${avatars}</div>`;

	function getStyle(coordinates){
		return `top:${coordinates.y}%;left:${coordinates.x}%;`
	}
	
	function randomizeCoordinates(){

		const coordinates = {
			x: 0,
			y: 0
		};

		if (Math.round(Math.random() * 2)){
			// 1 of every 3 users will appear in outer space
			coordinates.x = Math.round(Math.random() * 70) + 15;
			coordinates.y = Math.round(Math.random() * 50) + 25;
		} else {
			// 2 of every 3 users will appear in inner space
			coordinates.x = Math.round(Math.random() * 30) + 35;
			coordinates.y = Math.round(Math.random() * 30) + 35;
		}

		// if (Math.round(Math.random())) coordinates.y = 100 - coordinates.y;

		return coordinates;
	}

}